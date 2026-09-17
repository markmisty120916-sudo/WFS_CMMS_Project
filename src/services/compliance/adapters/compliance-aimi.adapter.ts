import type { ContextDto } from "../../../core/dto/context.dto";
import type { PredictiveEngineService } from "../../../aimi/predictive/predictive-engine.service";
import type { PredictiveInputs } from "../../../aimi/predictive/predictive-inputs.interface";
import type { PredictiveOutput } from "../../../aimi/predictive/predictive-output.interface";
import { isRoleAllowedToForecast } from "../../../aimi/predictive/predictive-rules";
import type { SeverityEngineService } from "../../../aimi/severity/severity-engine.service";
import type { SeverityInputs } from "../../../aimi/severity/severity-inputs.interface";
import type { SeverityOutput } from "../../../aimi/severity/severity-output.interface";
import { isRoleAllowedToClassify } from "../../../aimi/severity/severity-rules";
import type { DriverDefectReportInput, InspectionCompleteInput } from "../compliance.interface";
import type {
  ComplianceTelematicsAdapter,
  ComplianceTelematicsSignal,
} from "./compliance-telematics.adapter";

export class ComplianceAimiAdapter {
  private readonly severityEngine: SeverityEngineService;
  private readonly predictiveEngine: PredictiveEngineService;
  private readonly telematicsAdapter: ComplianceTelematicsAdapter;

  constructor(
    severityEngine: SeverityEngineService,
    predictiveEngine: PredictiveEngineService,
    telematicsAdapter: ComplianceTelematicsAdapter,
  ) {
    this.severityEngine = severityEngine;
    this.predictiveEngine = predictiveEngine;
    this.telematicsAdapter = telematicsAdapter;
  }

  async classifyInspection(
    dto: ContextDto,
    inspection_id: string,
    asset_id: string,
    complete: InspectionCompleteInput,
    contextInput: unknown,
  ): Promise<SeverityOutput | null> {
    if (isRoleAllowedToClassify(dto.role) === false) {
      return null;
    }
    const signals = await this.telematicsAdapter.loadSignals(asset_id);
    let telematics: SeverityInputs["telematics"] = "none";
    if (signals !== null) {
      telematics = this.telematicsAdapter.faultLevel(signals);
    }
    let compliance: SeverityInputs["compliance"] = "none";
    if (complete.result === "failed") {
      compliance = "blocks_operation";
    }
    if (complete.result === "passed") {
      if (complete.findings !== "") {
        compliance = "requires_correction";
      }
    }
    const inputs: SeverityInputs = {
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      timestamp: dto.timestamp,
      workorder_id: inspection_id,
      asset_id,
      safety_critical: complete.result === "failed",
      compliance,
      telematics,
      predictive: "none",
      pm: "none",
      technician_notes: "none",
      driver_defects: "none",
    };
    const result = await this.severityEngine.classify(inputs, contextInput, null);
    if (result.ok === false) {
      return null;
    }
    return result.value;
  }

  async classifyDriverReport(
    dto: ContextDto,
    violation_id: string,
    input: DriverDefectReportInput,
    contextInput: unknown,
  ): Promise<SeverityOutput | null> {
    if (isRoleAllowedToClassify(dto.role) === false) {
      return null;
    }
    let driver_defects: SeverityInputs["driver_defects"] = "moderate";
    if (input.severity === "safety") {
      driver_defects = "safety";
    }
    if (input.severity === "major") {
      driver_defects = "major";
    }
    if (input.severity === "minor") {
      driver_defects = "minor";
    }
    if (input.severity === "info") {
      driver_defects = "info";
    }
    const inputs: SeverityInputs = {
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      timestamp: dto.timestamp,
      workorder_id: violation_id,
      asset_id: input.asset_id,
      safety_critical: driver_defects === "safety",
      compliance: "none",
      telematics: "none",
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

  async forecast(
    dto: ContextDto,
    workorder_id: string,
    asset_id: string,
    severity: SeverityOutput | null,
    signals: readonly ComplianceTelematicsSignal[] | null,
    compliance_block: boolean,
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
      workorder_id,
      asset_id,
      telematics_cluster,
      pm: "none",
      diagnostic: "none",
      asset_health: "none",
      usage: "none",
      environmental: "none",
      technician_notes: "none",
      compliance_block,
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
