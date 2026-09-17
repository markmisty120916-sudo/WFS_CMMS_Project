import type { DiagnosticsEngineService } from "../../aimi/diagnostics/diagnostics-engine.service";
import type { DiagnosticsOutput } from "../../aimi/diagnostics/diagnostics-output.interface";
import type { LearningEngineService } from "../../aimi/learning/learning-engine.service";
import type { LearningOutput } from "../../aimi/learning/learning-output.interface";
import type { PredictiveEngineService } from "../../aimi/predictive/predictive-engine.service";
import type { PredictiveOutput } from "../../aimi/predictive/predictive-output.interface";
import type { RoutingEngineService } from "../../aimi/routing/routing-engine.service";
import type { RoutingOutput } from "../../aimi/routing/routing-output.interface";
import type { SchedulingEngineService } from "../../aimi/scheduling/scheduling-engine.service";
import type { SchedulingOutput } from "../../aimi/scheduling/scheduling-output.interface";
import type { SeverityEngineService } from "../../aimi/severity/severity-engine.service";
import type { SeverityOutput } from "../../aimi/severity/severity-output.interface";
import type { Database } from "../../core/database/database.interface";
import { createPreparedStatement } from "../../core/database/prepared-statement";
import type { DtoRole } from "../../core/dto/base.dto";
import type { ContextDto } from "../../core/dto/context.dto";
import { createError } from "../../core/errors/error-factory";
import type { ErrorType } from "../../core/errors/error-types";
import type { EventBusService } from "../../core/event-bus/event-bus.service";
import type { LifecycleEngineService } from "../../core/lifecycle-engine/lifecycle-engine.service";
import type { AuditLogHook, Logger } from "../../core/logger/logger.interface";
import { err } from "../../core/results/err";
import { ok } from "../../core/results/ok";
import type { Result } from "../../core/results/result.interface";
import type { ResultContext } from "../../core/results/result-context";
import type { RuleEngineService } from "../../core/rule-engine/rule-engine.service";
import { contextSchema, toRuleContext } from "../../core/validation/context.schema";
import { asRecord, asString } from "../../core/validation/dto.schema";
import { parseDtoRole } from "../../core/validation/role.schema";
import { TechnicianWorkflowAimiAdapter } from "./adapters/technician-workflow-aimi.adapter";
import { TechnicianWorkflowTelematicsAdapter } from "./adapters/technician-workflow-telematics.adapter";
import { isTechnicianWorkflowApiAllowed } from "./api/technician-workflow.api.permissions";
import { WorkflowDiagnosticsEngine } from "./engines/workflow-diagnostics.engine";
import { WorkflowLearningEngine } from "./engines/workflow-learning.engine";
import { WorkflowPredictiveEngine } from "./engines/workflow-predictive.engine";
import { WorkflowRoutingEngine } from "./engines/workflow-routing.engine";
import { WorkflowSchedulingEngine } from "./engines/workflow-scheduling.engine";
import { WorkflowStepsEngine } from "./engines/workflow-steps.engine";
import {
  parseWorkflowAction,
  parseWorkflowComplete,
  parseWorkflowListQuery,
  parseWorkflowStart,
  parseWorkflowStepUpdate,
} from "./technician-workflow-builder";
import {
  incomingEventFromWorkflowCompleted,
  technicianWorkflowAuditLogId,
  type TechnicianWorkflowAuditAction,
} from "./technician-workflow-events";
import {
  canPublishWorkflowCompleted,
  technicianAssignmentError,
  workflowImmutableError,
  workflowReadError,
  workflowWriteError,
} from "./technician-workflow-rules";
import {
  freezeWorkflowActionResult,
  freezeWorkflowInstance,
  freezeWorkflowListResult,
  type DiagnosticHistory,
  type TechnicianLearningProfile,
  type WorkflowActionResult,
  type WorkflowInstance,
  type WorkflowLabor,
  type WorkflowListResult,
  type WorkflowStep,
} from "./technician-workflow.interface";
import {
  filterWorkflowsByAsset,
  filterWorkflowsByStatus,
} from "./utils/technician-workflow-filters";

export type TechnicianWorkflowServiceOptions = {
  tenant_id: string;
  logger: Logger;
  database: Database;
  eventBus: EventBusService;
  auditLogHook: AuditLogHook;
  ruleEngine: RuleEngineService;
  lifecycleEngine: LifecycleEngineService;
  severityEngine: SeverityEngineService;
  routingEngine: RoutingEngineService;
  schedulingEngine: SchedulingEngineService;
  diagnosticsEngine: DiagnosticsEngineService;
  predictiveEngine: PredictiveEngineService;
  learningEngine: LearningEngineService;
};

function resultContextFromDto(dto: ContextDto): ResultContext {
  return {
    tenant_id: dto.tenant_id,
    user_id: dto.user_id,
    role: dto.role,
    timestamp: dto.timestamp,
    correlation_id: dto.correlation_id,
    rule_id: dto.rule_id,
    lifecycle_kind: dto.lifecycle_kind,
    from_state: dto.from_state,
    to_state: dto.to_state,
    entity_id: dto.entity_id,
  };
}

export class TechnicianWorkflowService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;
  private readonly eventBus: EventBusService;
  private readonly auditLogHook: AuditLogHook;
  private readonly ruleEngine: RuleEngineService;
  private readonly lifecycleEngine: LifecycleEngineService;
  private readonly stepsEngine: WorkflowStepsEngine;
  private readonly routingEngine: WorkflowRoutingEngine;
  private readonly schedulingEngine: WorkflowSchedulingEngine;
  private readonly diagnosticsEngine: WorkflowDiagnosticsEngine;
  private readonly predictiveEngine: WorkflowPredictiveEngine;
  private readonly learningEngine: WorkflowLearningEngine;
  private readonly aimiAdapter: TechnicianWorkflowAimiAdapter;

  constructor(options: TechnicianWorkflowServiceOptions) {
    if (options.tenant_id === "") {
      throw new Error("tenant_id required");
    }
    this.tenant_id = options.tenant_id;
    this.logger = options.logger;
    this.database = options.database;
    this.eventBus = options.eventBus;
    this.auditLogHook = options.auditLogHook;
    this.ruleEngine = options.ruleEngine;
    this.lifecycleEngine = options.lifecycleEngine;
    const telematicsAdapter = new TechnicianWorkflowTelematicsAdapter(
      options.tenant_id,
      options.database,
    );
    const aimiAdapter = new TechnicianWorkflowAimiAdapter(
      options.severityEngine,
      options.routingEngine,
      options.schedulingEngine,
      options.diagnosticsEngine,
      options.predictiveEngine,
      options.learningEngine,
      telematicsAdapter,
    );
    this.aimiAdapter = aimiAdapter;
    this.stepsEngine = new WorkflowStepsEngine(options.tenant_id, options.database);
    this.routingEngine = new WorkflowRoutingEngine(aimiAdapter);
    this.schedulingEngine = new WorkflowSchedulingEngine(aimiAdapter);
    this.diagnosticsEngine = new WorkflowDiagnosticsEngine(
      options.tenant_id,
      options.database,
      aimiAdapter,
    );
    this.predictiveEngine = new WorkflowPredictiveEngine(aimiAdapter, telematicsAdapter);
    this.learningEngine = new WorkflowLearningEngine(
      options.tenant_id,
      options.database,
      aimiAdapter,
    );
  }

  async listWorkflows(contextInput: unknown, queryInput: unknown): Promise<Result<WorkflowListResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isTechnicianWorkflowApiAllowed("list_workflows", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const readGate = workflowReadError(dto.role);
    if (readGate !== "none") {
      return this.fail(readGate, context);
    }
    const loaded = await this.stepsEngine.loadWorkflowList();
    if (loaded === null) {
      return this.fail("tenant_id mismatch", context);
    }
    const query = parseWorkflowListQuery(queryInput);
    let workflows = filterWorkflowsByStatus(loaded, query.status);
    workflows = filterWorkflowsByAsset(workflows, query.asset_id);
    if (dto.role === "TECHNICIAN") {
      const scoped: WorkflowInstance[] = [];
      let index = 0;
      while (index < workflows.length) {
        const assignment = technicianAssignmentError(
          dto.role,
          dto.user_id,
          workflows[index].routing_tech_id,
        );
        if (assignment === "none") {
          scoped.push(workflows[index]);
        }
        index = index + 1;
      }
      workflows = scoped;
    }
    return ok(
      freezeWorkflowListResult({
        tenant_id: this.tenant_id,
        role: dto.role,
        workflows,
      }),
      context,
    );
  }

  async getWorkflow(contextInput: unknown, workorder_id: string): Promise<Result<WorkflowActionResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isTechnicianWorkflowApiAllowed("get_workflow", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const readGate = workflowReadError(dto.role);
    if (readGate !== "none") {
      return this.fail(readGate, context);
    }
    if (workorder_id === "") {
      return this.fail("entity_id required", context);
    }
    const workflow = await this.stepsEngine.loadWorkflow(workorder_id);
    if (workflow === null) {
      return this.fail("entity_id mismatch", context);
    }
    const assignment = technicianAssignmentError(dto.role, dto.user_id, workflow.routing_tech_id);
    if (assignment !== "none") {
      return this.fail(assignment, context);
    }
    const steps = await this.stepsEngine.loadSteps(workorder_id);
    if (steps === null) {
      return this.fail("tenant_id mismatch", context);
    }
    return ok(
      freezeWorkflowActionResult({
        tenant_id: this.tenant_id,
        workflow,
        steps,
        labor: null,
        history: null,
        profile: null,
        severity: null,
        routing: null,
        scheduling: null,
        diagnostics: null,
        predictive: null,
        learning: null,
        voice: false,
        multilingual: false,
      }),
      context,
    );
  }

  async startWorkflow(
    contextInput: unknown,
    workorder_id: string,
    bodyInput: unknown,
  ): Promise<Result<WorkflowActionResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isTechnicianWorkflowApiAllowed("start_workflow", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const writeGate = workflowWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    if (workorder_id === "") {
      return this.fail("entity_id required", context);
    }
    const parsed = parseWorkflowStart(bodyInput);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType = parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      return this.fail(error_type, context);
    }
    if (parsed.data.workorder_id !== workorder_id) {
      return this.fail("dto invalid", context);
    }
    const current = await this.stepsEngine.loadWorkflow(workorder_id);
    if (current === null) {
      return this.fail("entity_id mismatch", context);
    }
    const immutable = workflowImmutableError(current.status);
    if (immutable !== "none") {
      return this.fail(immutable, context);
    }
    const assignment = technicianAssignmentError(dto.role, dto.user_id, current.routing_tech_id);
    if (assignment !== "none") {
      return this.fail(assignment, context);
    }
    let workflow = this.stepsEngine.applyStarted(current, dto.timestamp, dto.user_id);
    await this.stepsEngine.updateWorkflow(workflow);
    const steps = await this.requireSteps(workorder_id, context);
    if (steps.ok === false) {
      return steps;
    }
    const aimi = await this.runAimi(
      dto,
      workflow,
      steps.value,
      parsed.data.voice,
      parsed.data.multilingual,
      contextInput,
    );
    if (aimi.severity !== null) {
      workflow = this.stepsEngine.applySeverity(workflow, aimi.severity.severity, dto.timestamp);
    }
    workflow = this.applyRoutingSchedule(workflow, aimi.routing, aimi.scheduling, dto.timestamp);
    await this.stepsEngine.updateWorkflow(workflow);
    await this.audit(dto, workflow.workorder_id, "workflow.started", workflow.status);
    return ok(this.toActionResult(workflow, steps.value, null, null, null, aimi, parsed.data.voice, parsed.data.multilingual), context);
  }

  async updateStep(
    contextInput: unknown,
    workorder_id: string,
    bodyInput: unknown,
  ): Promise<Result<WorkflowActionResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isTechnicianWorkflowApiAllowed("update_step", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const writeGate = workflowWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    if (workorder_id === "") {
      return this.fail("entity_id required", context);
    }
    const current = await this.stepsEngine.loadWorkflow(workorder_id);
    if (current === null) {
      return this.fail("entity_id mismatch", context);
    }
    const immutable = workflowImmutableError(current.status);
    if (immutable !== "none") {
      return this.fail(immutable, context);
    }
    const assignment = technicianAssignmentError(dto.role, dto.user_id, current.routing_tech_id);
    if (assignment !== "none") {
      return this.fail(assignment, context);
    }
    const parsed = parseWorkflowStepUpdate(bodyInput);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType = parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      return this.fail(error_type, context);
    }
    const note_id = workorder_id + ":step:" + dto.timestamp;
    const step = this.stepsEngine.buildStep(
      this.tenant_id,
      note_id,
      workorder_id,
      dto.user_id,
      parsed.data.note_text,
      parsed.data.skipped,
      dto.timestamp,
    );
    await this.stepsEngine.insertStep(step);
    const labor = this.stepsEngine.buildLabor(
      this.tenant_id,
      workorder_id + ":labor:" + dto.timestamp,
      workorder_id,
      dto.user_id,
      parsed.data.hours,
      dto.timestamp,
    );
    if (labor !== null) {
      await this.stepsEngine.insertLabor(labor);
    }
    const steps = await this.requireSteps(workorder_id, context);
    if (steps.ok === false) {
      return steps;
    }
    const aimi = await this.runAimi(dto, current, steps.value, false, false, contextInput);
    await this.audit(dto, workorder_id, "workflow.step.updated", step.note_text);
    return ok(this.toActionResult(current, steps.value, labor, null, null, aimi, false, false), context);
  }

  async completeWorkflow(
    contextInput: unknown,
    workorder_id: string,
    bodyInput: unknown,
  ): Promise<Result<WorkflowActionResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isTechnicianWorkflowApiAllowed("complete_workflow", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const writeGate = workflowWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    if (workorder_id === "") {
      return this.fail("entity_id required", context);
    }
    const current = await this.stepsEngine.loadWorkflow(workorder_id);
    if (current === null) {
      return this.fail("entity_id mismatch", context);
    }
    const immutable = workflowImmutableError(current.status);
    if (immutable !== "none") {
      return this.fail(immutable, context);
    }
    const assignment = technicianAssignmentError(dto.role, dto.user_id, current.routing_tech_id);
    if (assignment !== "none") {
      return this.fail(assignment, context);
    }
    const parsed = parseWorkflowComplete(bodyInput);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType = parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      return this.fail(error_type, context);
    }
    const steps = await this.requireSteps(workorder_id, context);
    if (steps.ok === false) {
      return steps;
    }
    const skipped = this.stepsEngine.skippedCount(steps.value);
    const history = this.diagnosticsEngine.buildHistory(
      workorder_id,
      dto.timestamp,
      steps.value,
      skipped,
      parsed.data.outcome,
    );
    await this.diagnosticsEngine.insertHistory(history);
    const existing_profile = await this.learningEngine.loadProfile(dto.user_id);
    let profile_id = dto.user_id + ":profile";
    if (existing_profile !== null) {
      profile_id = existing_profile.profile_id;
    }
    const profile = this.learningEngine.applyProfile(
      existing_profile,
      this.tenant_id,
      profile_id,
      dto.user_id,
      dto.timestamp,
      steps.value.length,
      skipped,
      parsed.data.hours,
    );
    await this.learningEngine.persistProfile(profile, existing_profile !== null);
    const labor = this.stepsEngine.buildLabor(
      this.tenant_id,
      workorder_id + ":labor:" + dto.timestamp,
      workorder_id,
      dto.user_id,
      parsed.data.hours,
      dto.timestamp,
    );
    if (labor !== null) {
      await this.stepsEngine.insertLabor(labor);
    }
    const workflow = this.stepsEngine.applyCompleted(current, dto.timestamp);
    await this.stepsEngine.updateWorkflow(workflow);
    const aimi = await this.runAimi(
      dto,
      workflow,
      steps.value,
      parsed.data.voice,
      parsed.data.multilingual,
      contextInput,
    );
    await this.audit(dto, workflow.workorder_id, "workflow.completed", parsed.data.outcome);
    if (canPublishWorkflowCompleted(dto.role) === true) {
      await this.eventBus.publish(incomingEventFromWorkflowCompleted(dto, workflow));
    }
    return ok(
      this.toActionResult(
        workflow,
        steps.value,
        labor,
        history,
        profile,
        aimi,
        parsed.data.voice,
        parsed.data.multilingual,
      ),
      context,
    );
  }

  async technicianAction(
    contextInput: unknown,
    workorder_id: string,
    bodyInput: unknown,
  ): Promise<Result<WorkflowActionResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isTechnicianWorkflowApiAllowed("technician_action", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const writeGate = workflowWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    if (workorder_id === "") {
      return this.fail("entity_id required", context);
    }
    const current = await this.stepsEngine.loadWorkflow(workorder_id);
    if (current === null) {
      return this.fail("entity_id mismatch", context);
    }
    const immutable = workflowImmutableError(current.status);
    if (immutable !== "none") {
      return this.fail(immutable, context);
    }
    const assignment = technicianAssignmentError(dto.role, dto.user_id, current.routing_tech_id);
    if (assignment !== "none") {
      return this.fail(assignment, context);
    }
    const parsed = parseWorkflowAction(bodyInput);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType = parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      return this.fail(error_type, context);
    }
    if (parsed.data.note_text !== "") {
      const step = this.stepsEngine.buildStep(
        this.tenant_id,
        workorder_id + ":action:" + dto.timestamp,
        workorder_id,
        dto.user_id,
        parsed.data.note_text,
        false,
        dto.timestamp,
      );
      await this.stepsEngine.insertStep(step);
    }
    const labor = this.stepsEngine.buildLabor(
      this.tenant_id,
      workorder_id + ":labor:" + dto.timestamp,
      workorder_id,
      dto.user_id,
      parsed.data.hours,
      dto.timestamp,
    );
    if (labor !== null) {
      await this.stepsEngine.insertLabor(labor);
    }
    const steps = await this.requireSteps(workorder_id, context);
    if (steps.ok === false) {
      return steps;
    }
    const aimi = await this.runAimi(dto, current, steps.value, false, false, contextInput);
    await this.audit(dto, workorder_id, "workflow.step.updated", parsed.data.note_text);
    return ok(this.toActionResult(current, steps.value, labor, null, null, aimi, false, false), context);
  }

  private applyRoutingSchedule(
    workflow: WorkflowInstance,
    routing: RoutingOutput | null,
    scheduling: SchedulingOutput | null,
    timestamp: string,
  ): WorkflowInstance {
    let routing_tech_id = workflow.routing_tech_id;
    let routing_bay_id = workflow.routing_bay_id;
    let scheduled_start = workflow.scheduled_start;
    let scheduled_end = workflow.scheduled_end;
    if (routing !== null) {
      if (routing.technician_id !== "") {
        routing_tech_id = routing.technician_id;
      }
      if (routing.bay_id !== "") {
        routing_bay_id = routing.bay_id;
      }
    }
    if (scheduling !== null) {
      scheduled_start = scheduling.scheduled_start;
      scheduled_end = scheduling.scheduled_end;
    }
    return freezeWorkflowInstance({
      tenant_id: workflow.tenant_id,
      workorder_id: workflow.workorder_id,
      asset_id: workflow.asset_id,
      source: workflow.source,
      description: workflow.description,
      severity: workflow.severity,
      routing_tech_id,
      routing_bay_id,
      scheduled_start,
      scheduled_end,
      status: workflow.status,
      created_by: workflow.created_by,
      created_at: workflow.created_at,
      updated_at: timestamp,
      deleted_at: workflow.deleted_at,
    });
  }

  private async runAimi(
    dto: ContextDto,
    workflow: WorkflowInstance,
    steps: readonly WorkflowStep[],
    voice: boolean,
    multilingual: boolean,
    contextInput: unknown,
  ): Promise<{
    severity: SeverityOutput | null;
    routing: RoutingOutput | null;
    scheduling: SchedulingOutput | null;
    diagnostics: DiagnosticsOutput | null;
    predictive: PredictiveOutput | null;
    learning: LearningOutput | null;
  }> {
    const severity = await this.aimiAdapter.classify(dto, workflow, steps, contextInput);
    const routing = await this.routingEngine.assign(dto, workflow, severity, contextInput);
    const scheduling = await this.schedulingEngine.assign(dto, workflow, severity, routing, contextInput);
    const predictive = await this.predictiveEngine.forecast(dto, workflow, severity, contextInput);
    const diagnostics = await this.diagnosticsEngine.start(
      dto,
      workflow,
      severity,
      routing,
      scheduling,
      predictive,
      contextInput,
    );
    const skipped = this.stepsEngine.skippedCount(steps);
    const learning = await this.learningEngine.generate(
      dto,
      workflow,
      steps,
      skipped,
      voice,
      multilingual,
      severity,
      routing,
      scheduling,
      predictive,
      diagnostics,
      contextInput,
    );
    return { severity, routing, scheduling, diagnostics, predictive, learning };
  }

  private toActionResult(
    workflow: WorkflowInstance,
    steps: readonly WorkflowStep[],
    labor: WorkflowLabor | null,
    history: DiagnosticHistory | null,
    profile: TechnicianLearningProfile | null,
    aimi: {
      severity: SeverityOutput | null;
      routing: RoutingOutput | null;
      scheduling: SchedulingOutput | null;
      diagnostics: DiagnosticsOutput | null;
      predictive: PredictiveOutput | null;
      learning: LearningOutput | null;
    },
    voice: boolean,
    multilingual: boolean,
  ): WorkflowActionResult {
    return freezeWorkflowActionResult({
      tenant_id: this.tenant_id,
      workflow,
      steps,
      labor,
      history,
      profile,
      severity: aimi.severity,
      routing: aimi.routing,
      scheduling: aimi.scheduling,
      diagnostics: aimi.diagnostics,
      predictive: aimi.predictive,
      learning: aimi.learning,
      voice,
      multilingual,
    });
  }

  private async requireSteps(
    workorder_id: string,
    context: ResultContext,
  ): Promise<Result<readonly WorkflowStep[]>> {
    const steps = await this.stepsEngine.loadSteps(workorder_id);
    if (steps === null) {
      return this.fail("tenant_id mismatch", context);
    }
    return ok(steps, context);
  }

  private async open(contextInput: unknown): Promise<Result<ContextDto>> {
    const parsed = contextSchema.safeParse(contextInput, this.tenant_id);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType =
        parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      const identity = this.identityFromInput(contextInput);
      const context: ResultContext = {
        tenant_id: this.tenant_id,
        user_id: identity.user_id,
        role: identity.role,
        timestamp: identity.timestamp,
        correlation_id: identity.correlation_id,
        rule_id: "",
        lifecycle_kind: "",
        from_state: "",
        to_state: "",
        entity_id: identity.entity_id,
      };
      return this.fail(error_type, context);
    }
    const dto = parsed.data;
    const context = resultContextFromDto(dto);
    if (dto.user_id === "") {
      return this.fail("user_id required", context);
    }
    const rule = await this.ruleEngine.evaluate(toRuleContext(dto));
    if (rule.allowed === false) {
      const error_type: ErrorType =
        rule.error_code === "none" ? "role unauthorized" : rule.error_code;
      return this.fail(error_type, context);
    }
    return ok(dto, context);
  }

  private identityFromInput(input: unknown): {
    user_id: string;
    role: DtoRole;
    timestamp: string;
    correlation_id: string;
    entity_id: string;
  } {
    const record = asRecord(input);
    if (record === null) {
      throw new Error("dto invalid");
    }
    const user_id = asString(record.user_id);
    if (user_id === "") {
      throw new Error("user_id required");
    }
    const timestamp = asString(record.timestamp);
    if (timestamp === "") {
      throw new Error("timestamp required");
    }
    const role = parseDtoRole(record.role);
    if (role === null) {
      throw new Error("role invalid");
    }
    return {
      user_id,
      role,
      timestamp,
      correlation_id: asString(record.correlation_id),
      entity_id: asString(record.entity_id),
    };
  }

  private fail(error_type: ErrorType, context: ResultContext): Result<never> {
    const error = createError(error_type, {
      tenant_id: this.tenant_id,
      user_id: context.user_id,
      role: context.role,
      timestamp: context.timestamp,
      correlation_id: context.correlation_id,
    });
    return err(error, context);
  }

  private async audit(
    dto: ContextDto,
    entity_id: string,
    action: TechnicianWorkflowAuditAction,
    new_value: string,
  ): Promise<void> {
    this.logger.info(action);
    this.auditLogHook.write({
      level: "info",
      message: action,
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      correlation_id: entity_id,
      timestamp: dto.timestamp,
    });
    const log_id = technicianWorkflowAuditLogId(entity_id, action, dto.timestamp);
    const statement = createPreparedStatement(
      "INSERT INTO IntegrationLogs (log_id, tenant_id, event_id, message, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $5, NULL)",
      [
        dto.tenant_id,
        log_id,
        log_id,
        JSON.stringify({
          tenant_id: dto.tenant_id,
          user_id: dto.user_id,
          role: dto.role,
          timestamp: dto.timestamp,
          action,
          previous_value: "",
          new_value,
        }),
        dto.timestamp,
      ],
    );
    await this.database.execute(statement);
  }
}
