import type { PredictiveEngineService } from "../../aimi/predictive/predictive-engine.service";
import type { SeverityEngineService } from "../../aimi/severity/severity-engine.service";
import type { Database } from "../../core/database/database.interface";
import { createPreparedStatement } from "../../core/database/prepared-statement";
import type { DtoRole } from "../../core/dto/base.dto";
import type { ContextDto } from "../../core/dto/context.dto";
import { createError } from "../../core/errors/error-factory";
import type { ErrorType } from "../../core/errors/error-types";
import type { EventBusService } from "../../core/event-bus/event-bus.service";
import type { LifecycleContext } from "../../core/lifecycle-engine/lifecycle-context";
import type { LifecycleEngineService } from "../../core/lifecycle-engine/lifecycle-engine.service";
import {
  createLifecycleSnapshot,
  type LifecycleSnapshot,
} from "../../core/lifecycle-engine/lifecycle-snapshot";
import type { LifecycleState } from "../../core/lifecycle-engine/lifecycle-state.interface";
import type { AuditLogHook, Logger } from "../../core/logger/logger.interface";
import { err } from "../../core/results/err";
import { ok } from "../../core/results/ok";
import type { Result } from "../../core/results/result.interface";
import type { ResultContext } from "../../core/results/result-context";
import type { RuleEngineService } from "../../core/rule-engine/rule-engine.service";
import { contextSchema, toRuleContext } from "../../core/validation/context.schema";
import { asRecord, asString } from "../../core/validation/dto.schema";
import { parseDtoRole } from "../../core/validation/role.schema";
import { ComplianceAimiAdapter } from "./adapters/compliance-aimi.adapter";
import { ComplianceTelematicsAdapter } from "./adapters/compliance-telematics.adapter";
import { isComplianceApiAllowed } from "./api/compliance.api.permissions";
import {
  applyTemplateWrite,
  buildTemplateForSoftDelete,
  parseDriverReport,
  parseInspectionComplete,
  parseInspectionInstanceCreate,
  parseInspectionListQuery,
  parseInspectionTemplateCreate,
  parseInspectionTemplateUpdate,
} from "./compliance-builder";
import {
  complianceAuditLogId,
  incomingEventFromDriverReport,
  incomingEventFromInspectionCompleted,
  type ComplianceAuditAction,
} from "./compliance-events";
import {
  canPublishComplianceEvent,
  complianceWriteError,
  driverReportError,
  inspectionCompletedImmutableError,
} from "./compliance-rules";
import {
  freezeDriverReportResult,
  freezeInspectionCompletion,
  freezeInspectionListResult,
  freezeInspectionTemplateListResult,
  type DriverReportResult,
  type InspectionCompletion,
  type InspectionListResult,
  type InspectionTemplate,
  type InspectionTemplateListResult,
} from "./compliance.interface";
import { DotComplianceEngine } from "./engines/dot-compliance.engine";
import { DriverReportEngine } from "./engines/driver-report.engine";
import { InspectionChecklistEngine } from "./engines/inspection-checklist.engine";
import { InspectionResultEngine } from "./engines/inspection-result.engine";
import { InspectionScheduleEngine } from "./engines/inspection-schedule.engine";
import { InspectionTemplateEngine } from "./engines/inspection-template.engine";
import { filterInspectionsByAsset, filterInspectionsByType } from "./utils/compliance-filters";

export type ComplianceServiceOptions = {
  tenant_id: string;
  logger: Logger;
  database: Database;
  eventBus: EventBusService;
  auditLogHook: AuditLogHook;
  ruleEngine: RuleEngineService;
  lifecycleEngine: LifecycleEngineService;
  severityEngine: SeverityEngineService;
  predictiveEngine: PredictiveEngineService;
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

export class ComplianceService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;
  private readonly eventBus: EventBusService;
  private readonly auditLogHook: AuditLogHook;
  private readonly ruleEngine: RuleEngineService;
  private readonly lifecycleEngine: LifecycleEngineService;
  private readonly templateEngine: InspectionTemplateEngine;
  private readonly scheduleEngine: InspectionScheduleEngine;
  private readonly checklistEngine: InspectionChecklistEngine;
  private readonly resultEngine: InspectionResultEngine;
  private readonly driverReportEngine: DriverReportEngine;
  private readonly dotEngine: DotComplianceEngine;
  private readonly aimiAdapter: ComplianceAimiAdapter;
  private readonly telematicsAdapter: ComplianceTelematicsAdapter;

  constructor(options: ComplianceServiceOptions) {
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
    this.templateEngine = new InspectionTemplateEngine(options.tenant_id, options.database);
    this.scheduleEngine = new InspectionScheduleEngine(options.tenant_id, options.database);
    this.checklistEngine = new InspectionChecklistEngine();
    this.resultEngine = new InspectionResultEngine();
    this.driverReportEngine = new DriverReportEngine(options.tenant_id, options.database);
    this.dotEngine = new DotComplianceEngine();
    this.telematicsAdapter = new ComplianceTelematicsAdapter(options.tenant_id, options.database);
    this.aimiAdapter = new ComplianceAimiAdapter(
      options.severityEngine,
      options.predictiveEngine,
      this.telematicsAdapter,
    );
  }

  async listTemplates(contextInput: unknown): Promise<Result<InspectionTemplateListResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isComplianceApiAllowed("list_templates", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const templates = await this.templateEngine.loadList();
    if (templates === null) {
      return this.fail("tenant_id mismatch", context);
    }
    return ok(
      freezeInspectionTemplateListResult({
        tenant_id: this.tenant_id,
        role: dto.role,
        templates,
      }),
      context,
    );
  }

  async createTemplate(contextInput: unknown, bodyInput: unknown): Promise<Result<InspectionTemplate>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isComplianceApiAllowed("create_template", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const writeGate = complianceWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    if (dto.entity_id === "") {
      return this.fail("entity_id required", context);
    }
    const parsed = parseInspectionTemplateCreate(bodyInput);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType = parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      return this.fail(error_type, context);
    }
    const built = applyTemplateWrite(this.tenant_id, dto.entity_id, dto.timestamp, parsed.data, null);
    if (built.success === false || built.value === null) {
      return this.fail(built.error_code, context);
    }
    await this.templateEngine.insert(built.value);
    await this.audit(dto, built.value.inspection_id, "compliance.inspection.template.created", "created");
    return ok(built.value, context);
  }

  async updateTemplate(
    contextInput: unknown,
    inspection_id: string,
    bodyInput: unknown,
  ): Promise<Result<InspectionTemplate>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isComplianceApiAllowed("update_template", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const writeGate = complianceWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    if (inspection_id === "") {
      return this.fail("entity_id required", context);
    }
    const current = await this.templateEngine.load(inspection_id);
    if (current === null) {
      return this.fail("entity_id mismatch", context);
    }
    const parsed = parseInspectionTemplateUpdate(bodyInput);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType = parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      return this.fail(error_type, context);
    }
    const built = applyTemplateWrite(this.tenant_id, inspection_id, dto.timestamp, parsed.data, current);
    if (built.success === false || built.value === null) {
      return this.fail(built.error_code, context);
    }
    await this.templateEngine.update(built.value);
    await this.audit(dto, built.value.inspection_id, "compliance.inspection.template.updated", "updated");
    return ok(built.value, context);
  }

  async deleteTemplate(contextInput: unknown, inspection_id: string): Promise<Result<InspectionTemplate>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isComplianceApiAllowed("delete_template", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const writeGate = complianceWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    if (inspection_id === "") {
      return this.fail("entity_id required", context);
    }
    const current = await this.templateEngine.load(inspection_id);
    if (current === null) {
      return this.fail("entity_id mismatch", context);
    }
    const built = buildTemplateForSoftDelete(current, dto.timestamp);
    if (built.success === false || built.value === null) {
      return this.fail(built.error_code, context);
    }
    await this.templateEngine.softDelete(built.value);
    await this.audit(dto, built.value.inspection_id, "compliance.inspection.template.deleted", "deleted");
    return ok(built.value, context);
  }

  async listInspections(contextInput: unknown, queryInput: unknown): Promise<Result<InspectionListResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isComplianceApiAllowed("list_inspections", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const query = parseInspectionListQuery(queryInput);
    const loaded = await this.scheduleEngine.loadList(query.asset_id);
    if (loaded === null) {
      return this.fail("tenant_id mismatch", context);
    }
    let inspections = filterInspectionsByType(loaded, query.type);
    if (dto.role === "DRIVER") {
      if (dto.entity_id === "") {
        return this.fail("entity_id required", context);
      }
      inspections = filterInspectionsByAsset(inspections, dto.entity_id);
    }
    return ok(
      freezeInspectionListResult({
        tenant_id: this.tenant_id,
        role: dto.role,
        inspections,
      }),
      context,
    );
  }

  async createInspection(contextInput: unknown, bodyInput: unknown): Promise<Result<InspectionCompletion["inspection"]>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isComplianceApiAllowed("create_inspection", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const writeGate = complianceWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    if (dto.entity_id === "") {
      return this.fail("entity_id required", context);
    }
    const parsed = parseInspectionInstanceCreate(bodyInput);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType = parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      return this.fail(error_type, context);
    }
    const instance = this.scheduleEngine.buildInstance(
      this.tenant_id,
      dto.entity_id,
      dto.timestamp,
      parsed.data,
    );
    await this.scheduleEngine.insert(instance);
    await this.lifecycleEngine.start({
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      kind: "compliance",
      entity_id: instance.inspection_id,
      state: "COMPLIANCE_TRIGGER",
      timestamp: dto.timestamp,
    });
    await this.audit(dto, instance.inspection_id, "compliance.inspection.instance.created", "created");
    return ok(instance, context);
  }

  async completeInspection(
    contextInput: unknown,
    inspection_id: string,
    bodyInput: unknown,
  ): Promise<Result<InspectionCompletion>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isComplianceApiAllowed("complete_inspection", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const writeGate = complianceWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    if (inspection_id === "") {
      return this.fail("entity_id required", context);
    }
    const instance = await this.scheduleEngine.load(inspection_id);
    if (instance === null) {
      return this.fail("entity_id mismatch", context);
    }
    const immutable = inspectionCompletedImmutableError(instance.status);
    if (immutable !== "none") {
      return this.fail(immutable, context);
    }
    const parsed = parseInspectionComplete(bodyInput);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType = parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      return this.fail(error_type, context);
    }
    const checklist = this.checklistEngine.build(instance, false, false);
    const result = this.resultEngine.build(instance, parsed.data);
    let snapshot = createLifecycleSnapshot(
      {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        kind: "compliance",
        entity_id: inspection_id,
        state: "COMPLIANCE_TRIGGER",
        timestamp: dto.timestamp,
      },
      "",
    );
    snapshot = await this.advanceComplianceLifecycle(dto, snapshot, "COMPLIANCE_EXECUTION");
    const severity = await this.aimiAdapter.classifyInspection(
      dto,
      instance.inspection_id,
      instance.asset_id,
      parsed.data,
      contextInput,
    );
    const signals = await this.telematicsAdapter.loadSignals(instance.asset_id);
    const predictive = await this.aimiAdapter.forecast(
      dto,
      instance.inspection_id,
      instance.asset_id,
      severity,
      signals,
      parsed.data.result === "failed",
      contextInput,
    );
    await this.advanceComplianceLifecycle(dto, snapshot, "AIMI_PREDICTIVE_COMPLIANCE_UPDATES");
    const completed = await this.scheduleEngine.markCompleted(instance, parsed.data.result, dto.timestamp);
    await this.audit(dto, completed.inspection_id, "compliance.inspection.instance.completed", parsed.data.result);
    if (canPublishComplianceEvent(dto.role) === true) {
      await this.eventBus.publish(incomingEventFromInspectionCompleted(dto, completed));
    }
    return ok(
      freezeInspectionCompletion({
        tenant_id: this.tenant_id,
        inspection: completed,
        checklist,
        result,
        severity,
        predictive,
      }),
      context,
    );
  }

  async createDriverReport(contextInput: unknown, bodyInput: unknown): Promise<Result<DriverReportResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isComplianceApiAllowed("create_driver_report", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const reportGate = driverReportError(dto.role);
    if (reportGate !== "none") {
      return this.fail(reportGate, context);
    }
    if (dto.entity_id === "") {
      return this.fail("entity_id required", context);
    }
    const parsed = parseDriverReport(bodyInput);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType = parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      return this.fail(error_type, context);
    }
    if (dto.role === "DRIVER") {
      if (dto.entity_id !== parsed.data.asset_id) {
        return this.fail("role unauthorized", context);
      }
    }
    const report = this.driverReportEngine.build(
      this.tenant_id,
      dto.entity_id,
      dto.timestamp,
      parsed.data,
    );
    await this.driverReportEngine.insert(report);
    const severity = await this.aimiAdapter.classifyDriverReport(
      dto,
      report.violation_id,
      parsed.data,
      contextInput,
    );
    const signals = await this.telematicsAdapter.loadSignals(report.asset_id);
    const predictive = await this.aimiAdapter.forecast(
      dto,
      report.violation_id,
      report.asset_id,
      severity,
      signals,
      parsed.data.severity === "safety",
      contextInput,
    );
    await this.audit(dto, report.violation_id, "compliance.driver.report.created", "created");
    if (canPublishComplianceEvent(dto.role) === true) {
      await this.eventBus.publish(incomingEventFromDriverReport(dto, report));
    }
    return ok(
      freezeDriverReportResult({
        tenant_id: this.tenant_id,
        report,
        severity,
        predictive,
      }),
      context,
    );
  }

  private async advanceComplianceLifecycle(
    dto: ContextDto,
    snapshot: LifecycleSnapshot,
    stop_state: LifecycleState,
  ): Promise<LifecycleSnapshot> {
    const order: LifecycleState[] = [
      "COMPLIANCE_TRIGGER",
      "AIMI_COMPLIANCE_INTAKE",
      "COMPLIANCE_WORKORDER_DRAFT",
      "CONDITIONAL_APPROVAL_LOGIC",
      "AIMI_COMPLIANCE_SCHEDULING",
      "AIMI_COMPLIANCE_ASSIGNMENT",
      "COMPLIANCE_EXECUTION",
      "COMPLIANCE_QA_REVIEW",
      "COMPLIANCE_CLOSURE",
      "COMPLIANCE_REPORTING",
      "AIMI_PREDICTIVE_COMPLIANCE_UPDATES",
    ];
    let current = snapshot;
    let from_index = 0;
    let stop_index = 0;
    let index = 0;
    while (index < order.length) {
      if (order[index] === current.state) {
        from_index = index;
      }
      if (order[index] === stop_state) {
        stop_index = index;
      }
      index = index + 1;
    }
    while (from_index < stop_index) {
      const to_state = order[from_index + 1];
      const context: LifecycleContext = {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        kind: "compliance",
        entity_id: snapshot.entity_id,
        state: current.state,
        timestamp: dto.timestamp,
      };
      current = await this.lifecycleEngine.transition(current, context, to_state);
      from_index = from_index + 1;
    }
    return current;
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
    action: ComplianceAuditAction,
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
    const log_id = complianceAuditLogId(entity_id, action, dto.timestamp);
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
