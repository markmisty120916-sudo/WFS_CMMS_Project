import type { ContextDto } from "../../../core/dto/context.dto";
import type { DiagnosticsEngineService } from "../../../aimi/diagnostics/diagnostics-engine.service";
import type { DiagnosticInputs } from "../../../aimi/diagnostics/diagnostics-inputs.interface";
import type { DiagnosticsOutput } from "../../../aimi/diagnostics/diagnostics-output.interface";
import { isRoleAllowedToDiagnose } from "../../../aimi/diagnostics/diagnostics-rules";
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
import type { DriverDefectLevel, SeverityInputs } from "../../../aimi/severity/severity-inputs.interface";
import type { SeverityOutput } from "../../../aimi/severity/severity-output.interface";
import { isRoleAllowedToClassify } from "../../../aimi/severity/severity-rules";
import type { DriverDefect } from "../driver-defect.interface";
import type {
  DriverDefectTelematicsAdapter,
  DriverDefectTelematicsSignal,
} from "./driver-defect-telematics.adapter";

function asDriverDefectLevel(value: string): DriverDefectLevel {
  if (value === "safety") {
    return "safety";
  }
  if (value === "major") {
    return "major";
  }
  if (value === "moderate") {
    return "moderate";
  }
  if (value === "minor") {
    return "minor";
  }
  if (value === "info") {
    return "info";
  }
  return "none";
}

export class DriverDefectAimiAdapter {
  private readonly severityEngine: SeverityEngineService;
  private readonly routingEngine: RoutingEngineService;
  private readonly schedulingEngine: SchedulingEngineService;
  private readonly diagnosticsEngine: DiagnosticsEngineService;
  private readonly predictiveEngine: PredictiveEngineService;
  private readonly telematicsAdapter: DriverDefectTelematicsAdapter;

  constructor(
    severityEngine: SeverityEngineService,
    routingEngine: RoutingEngineService,
    schedulingEngine: SchedulingEngineService,
    diagnosticsEngine: DiagnosticsEngineService,
    predictiveEngine: PredictiveEngineService,
    telematicsAdapter: DriverDefectTelematicsAdapter,
  ) {
    this.severityEngine = severityEngine;
    this.routingEngine = routingEngine;
    this.schedulingEngine = schedulingEngine;
    this.diagnosticsEngine = diagnosticsEngine;
    this.predictiveEngine = predictiveEngine;
    this.telematicsAdapter = telematicsAdapter;
  }

  async classify(
    dto: ContextDto,
    defect: DriverDefect,
    contextInput: unknown,
  ): Promise<SeverityOutput | null> {
    if (isRoleAllowedToClassify(dto.role) === false) {
      return null;
    }
    const signals = await this.telematicsAdapter.loadSignals(defect.asset_id);
    let telematics: SeverityInputs["telematics"] = "none";
    if (signals !== null) {
      telematics = this.telematicsAdapter.faultLevel(signals);
    }
    const driver_defects = asDriverDefectLevel(defect.severity);
    const inputs: SeverityInputs = {
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      timestamp: dto.timestamp,
      workorder_id: defect.defect_id,
      asset_id: defect.asset_id,
      safety_critical: driver_defects === "safety",
      compliance: "none",
      telematics,
      predictive: "none",
      pm: "none",
      technician_notes: "none",
      driver_defects,
    };
    const result = await this.severityEngine.classify(inputs, contextInput, null);
    if (result.ok === false) {
      return null;
    }
    return result.value;
  }

  async route(
    dto: ContextDto,
    defect: DriverDefect,
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
      workorder_id: defect.defect_id,
      asset_id: defect.asset_id,
      severity: severity.severity,
      workorder_is_pm: false,
      workorder_is_diagnostic: true,
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
    defect: DriverDefect,
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
      workorder_id: defect.defect_id,
      asset_id: defect.asset_id,
      severity: severity.severity,
      routed_technician_id: routing.technician_id,
      routed_bay_id: routing.bay_id,
      workorder_is_pm: false,
      workorder_is_diagnostic: true,
      predictive: "none",
      pm: "none",
      compliance_violation: defect.severity === "safety",
      asset: {
        asset_id: defect.asset_id,
        tenant_id: dto.tenant_id,
        restricted_operation: false,
        compliance_block: defect.severity === "safety",
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
    defect: DriverDefect,
    severity: SeverityOutput | null,
    routing: RoutingOutput | null,
    scheduling: SchedulingOutput | null,
    predictive: PredictiveOutput | null,
    contextInput: unknown,
  ): Promise<DiagnosticsOutput | null> {
    if (isRoleAllowedToDiagnose(dto.role) === false) {
      return null;
    }
    let level: DiagnosticInputs["severity"] = "S5";
    if (severity !== null) {
      level = severity.severity;
    }
    const inputs: DiagnosticInputs = {
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      timestamp: dto.timestamp,
      workorder_id: defect.defect_id,
      asset_id: defect.asset_id,
      technician_id: dto.user_id,
      severity: level,
      technician_speed: "Medium",
      telematics_fault: false,
      driver_defect: true,
      pm_finding: false,
      technician_note: defect.description !== "",
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
    defect: DriverDefect,
    severity: SeverityOutput | null,
    signals: readonly DriverDefectTelematicsSignal[] | null,
    contextInput: unknown,
  ): Promise<PredictiveOutput | null> {
    if (isRoleAllowedToForecast(dto.role) === false) {
      return null;
    }
    let telematics_cluster: PredictiveInputs["telematics_cluster"] = "none";
    if (signals !== null) {
      telematics_cluster = this.telematicsAdapter.clusterLevel(signals);
    }
    const inputs: PredictiveInputs = {
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      timestamp: dto.timestamp,
      workorder_id: defect.defect_id,
      asset_id: defect.asset_id,
      telematics_cluster,
      pm: "none",
      diagnostic: "none",
      asset_health: "none",
      usage: "none",
      environmental: "none",
      technician_notes: "none",
      compliance_block: defect.severity === "safety",
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
}
