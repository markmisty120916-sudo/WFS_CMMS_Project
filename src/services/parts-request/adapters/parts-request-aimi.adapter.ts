import type { ContextDto } from "../../../core/dto/context.dto";
import type { PredictiveEngineService } from "../../../aimi/predictive/predictive-engine.service";
import type { PredictiveInputs } from "../../../aimi/predictive/predictive-inputs.interface";
import type { PredictiveOutput } from "../../../aimi/predictive/predictive-output.interface";
import { isRoleAllowedToForecast } from "../../../aimi/predictive/predictive-rules";
import type { RoutingEngineService } from "../../../aimi/routing/routing-engine.service";
import type { BayCandidate, RoutingInputs, TechnicianCandidate } from "../../../aimi/routing/routing-inputs.interface";
import type { RoutingOutput } from "../../../aimi/routing/routing-output.interface";
import { isRoleAllowedToRoute } from "../../../aimi/routing/routing-rules";
import type { SeverityInputs } from "../../../aimi/severity/severity-inputs.interface";
import type { SeverityLevel } from "../../../aimi/severity/severity-levels";
import { freezeSeverityOutput, type SeverityOutput } from "../../../aimi/severity/severity-output.interface";
import type { PartsRequest, WorkorderLink } from "../parts-request.interface";

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

export class PartsRequestAimiAdapter {
  private readonly predictiveEngine: PredictiveEngineService;
  private readonly routingEngine: RoutingEngineService;

  constructor(predictiveEngine: PredictiveEngineService, routingEngine: RoutingEngineService) {
    this.predictiveEngine = predictiveEngine;
    this.routingEngine = routingEngine;
  }

  usageForStatus(status: string): PredictiveInputs["usage"] {
    if (status === "denied") {
      return "none";
    }
    if (status === "approved") {
      return "moderate";
    }
    if (status === "submitted") {
      return "moderate";
    }
    return "none";
  }

  async forecast(
    dto: ContextDto,
    request: PartsRequest,
    workorder: WorkorderLink | null,
    contextInput: unknown,
  ): Promise<PredictiveOutput | null> {
    if (isRoleAllowedToForecast(dto.role) === false) {
      return null;
    }
    let asset_id = request.part_id;
    let workorder_id = request.workorder_id;
    if (workorder !== null) {
      asset_id = workorder.asset_id;
      workorder_id = workorder.workorder_id;
    }
    if (workorder_id === "") {
      workorder_id = request.request_id;
    }
    const inputs: PredictiveInputs = {
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      timestamp: dto.timestamp,
      workorder_id,
      asset_id,
      telematics_cluster: "none",
      pm: "none",
      diagnostic: "none",
      asset_health: "none",
      usage: this.usageForStatus(request.status),
      environmental: "none",
      technician_notes: "none",
      compliance_block: false,
      repeated_s1_s2: false,
      repeated_s2: false,
    };
    const result = await this.predictiveEngine.forecast(
      inputs,
      null,
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

  async route(
    dto: ContextDto,
    request: PartsRequest,
    workorder: WorkorderLink | null,
    contextInput: unknown,
  ): Promise<RoutingOutput | null> {
    if (isRoleAllowedToRoute(dto.role) === false) {
      return null;
    }
    if (workorder === null) {
      return null;
    }
    if (workorder.workorder_id !== request.workorder_id) {
      return null;
    }
    const severity = asSeverityLevel(workorder.severity);
    if (severity === null) {
      return null;
    }
    if (severity !== "S5") {
      return null;
    }
    const technicians: TechnicianCandidate[] = [];
    const bays: BayCandidate[] = [];
    const inputs: RoutingInputs = {
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      timestamp: dto.timestamp,
      workorder_id: workorder.workorder_id,
      asset_id: workorder.asset_id,
      severity,
      workorder_is_pm: workorder.source === "pm",
      workorder_is_diagnostic: workorder.source === "diagnostic",
      technicians,
      bays,
    };
    const severity_inputs: SeverityInputs = {
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      timestamp: dto.timestamp,
      workorder_id: workorder.workorder_id,
      asset_id: workorder.asset_id,
      safety_critical: false,
      compliance: "none",
      telematics: "none",
      predictive: "none",
      pm: "none",
      technician_notes: "none",
      driver_defects: "none",
    };
    const severity_output: SeverityOutput = freezeSeverityOutput({
      severity,
      reason: "no routing required",
      inputs: severity_inputs,
      timestamp: dto.timestamp,
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
    });
    const result = await this.routingEngine.assign(inputs, severity_output, contextInput, null);
    if (result.ok === false) {
      return null;
    }
    return result.value;
  }
}
