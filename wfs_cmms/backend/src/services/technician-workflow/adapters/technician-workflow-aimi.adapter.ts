import type { ContextDto } from "../../../core/dto/context.dto";
import type { DiagnosticsEngineService } from "../../../aimi/diagnostics/diagnostics-engine.service";
import type { DiagnosticInputs } from "../../../aimi/diagnostics/diagnostics-inputs.interface";
import type { DiagnosticsOutput } from "../../../aimi/diagnostics/diagnostics-output.interface";
import { isRoleAllowedToDiagnose } from "../../../aimi/diagnostics/diagnostics-rules";
import type { LearningEngineService } from "../../../aimi/learning/learning-engine.service";
import type { LearningInputs } from "../../../aimi/learning/learning-inputs.interface";
import type { LearningOutput } from "../../../aimi/learning/learning-output.interface";
import { isRoleAllowedToGenerateLearning } from "../../../aimi/learning/learning-rules";
import type { PredictiveEngineService } from "../../../aimi/predictive/predictive-engine.service";
import type { PredictiveInputs } from "../../../aimi/predictive/predictive-inputs.interface";
import type { PredictiveOutput } from "../../../aimi/predictive/predictive-output.interface";
import { isRoleAllowedToForecast } from "../../../aimi/predictive/predictive-rules";
import type { RoutingEngineService } from "../../../aimi/routing/routing-engine.service";
import type { BayCandidate, RoutingInputs, TechnicianCandidate } from "../../../aimi/routing/routing-inputs.interface";
import type { RoutingOutput } from "../../../aimi/routing/routing-output.interface";
import { isRoleAllowedToRoute } from "../../../aimi/routing/routing-rules";
import type { SchedulingEngineService } from "../../../aimi/scheduling/scheduling-engine.service";
import type { SchedulingInputs } from "../../../aimi/scheduling/scheduling-inputs.interface";
import type { SchedulingOutput } from "../../../aimi/scheduling/scheduling-output.interface";
import { isRoleAllowedToSchedule } from "../../../aimi/scheduling/scheduling-rules";
import type { SeverityEngineService } from "../../../aimi/severity/severity-engine.service";
import type { SeverityInputs } from "../../../aimi/severity/severity-inputs.interface";
import type { SeverityLevel } from "../../../aimi/severity/severity-levels";
import type { SeverityOutput } from "../../../aimi/severity/severity-output.interface";
import { isRoleAllowedToClassify } from "../../../aimi/severity/severity-rules";
import type { WorkflowInstance, WorkflowStep } from "../technician-workflow.interface";
import type {
  TechnicianWorkflowTelematicsAdapter,
  WorkflowTelematicsSignal,
} from "./technician-workflow-telematics.adapter";

function asSeverityLevel(value: string): SeverityLevel | null {
  if (value === "S1") {
    return "S1";
  }
  if (value === "S2") {
    return "S2";
  }
  if (value === "S3") {
    return "S3";
  }
  if (value === "S4") {
    return "S4";
  }
  if (value === "S5") {
    return "S5";
  }
  return null;
}

export class TechnicianWorkflowAimiAdapter {
  private readonly severityEngine: SeverityEngineService;
  private readonly routingEngine: RoutingEngineService;
  private readonly schedulingEngine: SchedulingEngineService;
  private readonly diagnosticsEngine: DiagnosticsEngineService;
  private readonly predictiveEngine: PredictiveEngineService;
  private readonly learningEngine: LearningEngineService;
  private readonly telematicsAdapter: TechnicianWorkflowTelematicsAdapter;

  constructor(
    severityEngine: SeverityEngineService,
    routingEngine: RoutingEngineService,
    schedulingEngine: SchedulingEngineService,
    diagnosticsEngine: DiagnosticsEngineService,
    predictiveEngine: PredictiveEngineService,
    learningEngine: LearningEngineService,
    telematicsAdapter: TechnicianWorkflowTelematicsAdapter,
  ) {
    this.severityEngine = severityEngine;
    this.routingEngine = routingEngine;
    this.schedulingEngine = schedulingEngine;
    this.diagnosticsEngine = diagnosticsEngine;
    this.predictiveEngine = predictiveEngine;
    this.learningEngine = learningEngine;
    this.telematicsAdapter = telematicsAdapter;
  }

  async classify(
    dto: ContextDto,
    workflow: WorkflowInstance,
    steps: readonly WorkflowStep[],
    contextInput: unknown,
  ): Promise<SeverityOutput | null> {
    if (isRoleAllowedToClassify(dto.role) === false) {
      return null;
    }
    const signals = await this.telematicsAdapter.loadSignals(workflow.asset_id);
    let telematics: SeverityInputs["telematics"] = "none";
    if (signals !== null) {
      telematics = this.telematicsAdapter.faultLevel(signals);
    }
    let technician_notes: SeverityInputs["technician_notes"] = "none";
    if (workflow.description !== "") {
      technician_notes = "informational";
    }
    if (steps.length > 0) {
      technician_notes = "moderate";
    }
    let pm: SeverityInputs["pm"] = "none";
    if (workflow.source === "pm") {
      pm = "minor";
    }
    let compliance: SeverityInputs["compliance"] = "none";
    if (workflow.source === "compliance") {
      compliance = "requires_correction";
    }
    const inputs: SeverityInputs = {
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      timestamp: dto.timestamp,
      workorder_id: workflow.workorder_id,
      asset_id: workflow.asset_id,
      safety_critical: false,
      compliance,
      telematics,
      predictive: "none",
      pm,
      technician_notes,
      driver_defects: "none",
    };
    const result = await this.severityEngine.classify(inputs, contextInput, null);
    if (result.ok === false) {
      return null;
    }
    return result.value;
  }

  async route(
    dto: ContextDto,
    workflow: WorkflowInstance,
    severity: SeverityOutput | null,
    contextInput: unknown,
  ): Promise<RoutingOutput | null> {
    if (isRoleAllowedToRoute(dto.role) === false) {
      return null;
    }
    if (severity === null) {
      return null;
    }
    if (severity.severity !== "S5") {
      return null;
    }
    const technicians: TechnicianCandidate[] = [];
    const bays: BayCandidate[] = [];
    const inputs: RoutingInputs = {
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      timestamp: dto.timestamp,
      workorder_id: workflow.workorder_id,
      asset_id: workflow.asset_id,
      severity: severity.severity,
      workorder_is_pm: workflow.source === "pm",
      workorder_is_diagnostic: workflow.source === "diagnostic",
      technicians,
      bays,
    };
    const result = await this.routingEngine.assign(inputs, severity, contextInput, null);
    if (result.ok === false) {
      return null;
    }
    return result.value;
  }

  async schedule(
    dto: ContextDto,
    workflow: WorkflowInstance,
    severity: SeverityOutput | null,
    routing: RoutingOutput | null,
    contextInput: unknown,
  ): Promise<SchedulingOutput | null> {
    if (isRoleAllowedToSchedule(dto.role) === false) {
      return null;
    }
    if (severity === null) {
      return null;
    }
    if (routing === null) {
      return null;
    }
    if (severity.severity !== "S5") {
      return null;
    }
    const inputs: SchedulingInputs = {
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      timestamp: dto.timestamp,
      workorder_id: workflow.workorder_id,
      asset_id: workflow.asset_id,
      severity: severity.severity,
      routed_technician_id: routing.technician_id,
      routed_bay_id: routing.bay_id,
      workorder_is_pm: workflow.source === "pm",
      workorder_is_diagnostic: workflow.source === "diagnostic",
      predictive: "none",
      pm: "none",
      compliance_violation: false,
      asset: {
        asset_id: workflow.asset_id,
        tenant_id: dto.tenant_id,
        restricted_operation: false,
        compliance_block: false,
      },
      technicians: [],
      bays: [],
      windows: [],
    };
    const result = await this.schedulingEngine.assign(inputs, severity, routing, contextInput, null);
    if (result.ok === false) {
      return null;
    }
    return result.value;
  }

  async diagnose(
    dto: ContextDto,
    workflow: WorkflowInstance,
    severity: SeverityOutput | null,
    routing: RoutingOutput | null,
    scheduling: SchedulingOutput | null,
    predictive: PredictiveOutput | null,
    contextInput: unknown,
  ): Promise<DiagnosticsOutput | null> {
    if (isRoleAllowedToDiagnose(dto.role) === false) {
      return null;
    }
    let level: SeverityLevel = "S5";
    if (severity !== null) {
      level = severity.severity;
    }
    const coded = asSeverityLevel(workflow.severity);
    if (coded !== null) {
      if (severity === null) {
        level = coded;
      }
    }
    const inputs: DiagnosticInputs = {
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      timestamp: dto.timestamp,
      workorder_id: workflow.workorder_id,
      asset_id: workflow.asset_id,
      technician_id: dto.user_id,
      severity: level,
      technician_speed: "Medium",
      telematics_fault: false,
      driver_defect: false,
      pm_finding: workflow.source === "pm",
      technician_note: workflow.description !== "",
      predictive_alert: false,
      predictive_urgency: false,
      certified_diagnostic_flow: true,
      flows: [],
      steps: [],
    };
    const result = await this.diagnosticsEngine.start(
      inputs,
      severity,
      routing,
      scheduling,
      predictive,
      contextInput,
      null,
    );
    if (result.ok === false) {
      return null;
    }
    return result.value;
  }

  async forecast(
    dto: ContextDto,
    workflow: WorkflowInstance,
    severity: SeverityOutput | null,
    signals: readonly WorkflowTelematicsSignal[] | null,
    contextInput: unknown,
  ): Promise<PredictiveOutput | null> {
    if (isRoleAllowedToForecast(dto.role) === false) {
      return null;
    }
    let telematics_cluster: PredictiveInputs["telematics_cluster"] = "none";
    if (signals !== null) {
      telematics_cluster = this.telematicsAdapter.clusterLevel(signals);
    }
    let pm: PredictiveInputs["pm"] = "none";
    if (workflow.source === "pm") {
      pm = "upcoming";
    }
    const inputs: PredictiveInputs = {
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      timestamp: dto.timestamp,
      workorder_id: workflow.workorder_id,
      asset_id: workflow.asset_id,
      telematics_cluster,
      pm,
      diagnostic: "none",
      asset_health: "none",
      usage: "none",
      environmental: "none",
      technician_notes: "none",
      compliance_block: workflow.source === "compliance",
      repeated_s1_s2: false,
      repeated_s2: false,
    };
    const result = await this.predictiveEngine.forecast(
      inputs,
      severity,
      null,
      null,
      null,
      contextInput,
      null,
    );
    if (result.ok === false) {
      return null;
    }
    return result.value;
  }

  async learn(
    dto: ContextDto,
    workflow: WorkflowInstance,
    steps: readonly WorkflowStep[],
    skipped_count: number,
    voice: boolean,
    multilingual: boolean,
    severity: SeverityOutput | null,
    routing: RoutingOutput | null,
    scheduling: SchedulingOutput | null,
    predictive: PredictiveOutput | null,
    diagnostics: DiagnosticsOutput | null,
    contextInput: unknown,
  ): Promise<LearningOutput | null> {
    if (isRoleAllowedToGenerateLearning(dto.role) === false) {
      return null;
    }
    let technician_performance: LearningInputs["technician_performance"] = "none";
    if (steps.length > 0) {
      technician_performance = "average";
    }
    const inputs: LearningInputs = {
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      timestamp: dto.timestamp,
      workorder_id: workflow.workorder_id,
      asset_id: workflow.asset_id,
      technician_id: dto.user_id,
      insight_type: "technician",
      technician_performance,
      fleet_performance: "none",
      pattern: "none",
      diagnostic_completion: "average",
      repeat_repair: "none",
      step_compliance: "none",
      telematics_validation: "none",
      diagnostic_steps_taken: steps.length > 0,
      diagnostic_steps_skipped: skipped_count > 0,
      voice_usage: voice,
      multilingual_usage: multilingual,
      common_fault_patterns: false,
      common_repair_patterns: false,
      common_pm_failures: false,
      common_compliance_issues: false,
      asset_health_trends: false,
      predictive_accuracy_trends: false,
      weights: [],
    };
    const result = await this.learningEngine.generate(
      inputs,
      severity,
      routing,
      scheduling,
      predictive,
      diagnostics,
      contextInput,
      null,
    );
    if (result.ok === false) {
      return null;
    }
    return result.value;
  }
}
