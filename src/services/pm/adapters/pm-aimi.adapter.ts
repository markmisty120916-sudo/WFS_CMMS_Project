import type { ContextDto } from "../../../core/dto/context.dto";
import type { PredictiveEngineService } from "../../../aimi/predictive/predictive-engine.service";
import type { PredictiveInputs } from "../../../aimi/predictive/predictive-inputs.interface";
import type { PredictiveOutput } from "../../../aimi/predictive/predictive-output.interface";
import { isRoleAllowedToForecast } from "../../../aimi/predictive/predictive-rules";
import type { SeverityEngineService } from "../../../aimi/severity/severity-engine.service";
import type { SeverityInputs } from "../../../aimi/severity/severity-inputs.interface";
import type { SeverityOutput } from "../../../aimi/severity/severity-output.interface";
import { isRoleAllowedToClassify } from "../../../aimi/severity/severity-rules";
import type { PmCompleteInput, PmSchedule } from "../pm.interface";
import type { PmTelematicsAdapter, PmTelematicsSignal } from "./pm-telematics.adapter";

export class PmAimiAdapter {
  private readonly severityEngine: SeverityEngineService;
  private readonly predictiveEngine: PredictiveEngineService;
  private readonly telematicsAdapter: PmTelematicsAdapter;

  constructor(
    severityEngine: SeverityEngineService,
    predictiveEngine: PredictiveEngineService,
    telematicsAdapter: PmTelematicsAdapter,
  ) {
    this.severityEngine = severityEngine;
    this.predictiveEngine = predictiveEngine;
    this.telematicsAdapter = telematicsAdapter;
  }

  async classifyOnComplete(
    dto: ContextDto,
    schedule: PmSchedule,
    complete: PmCompleteInput,
    contextInput: unknown,
  ): Promise<SeverityOutput | null> {
    if (isRoleAllowedToClassify(dto.role) === false) {
      return null;
    }
    const signals = await this.telematicsAdapter.loadSignals(schedule.asset_id);
    let telematics: SeverityInputs["telematics"] = "none";
    if (signals !== null) {
      telematics = this.telematicsAdapter.faultLevel(signals);
    }
    let technician_notes: SeverityInputs["technician_notes"] = "informational";
    if (complete.findings !== "") {
      technician_notes = "moderate";
    }
    const inputs: SeverityInputs = {
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      timestamp: dto.timestamp,
      workorder_id: schedule.pm_schedule_id,
      asset_id: schedule.asset_id,
      safety_critical: false,
      compliance: "none",
      telematics,
      predictive: "none",
      pm: "minor",
      technician_notes,
      driver_defects: "none",
    };
    const result = await this.severityEngine.classify(inputs, contextInput, null);
    if (result.ok === false) {
      return null;
    }
    return result.value;
  }

  async forecastOnComplete(
    dto: ContextDto,
    schedule: PmSchedule,
    severity: SeverityOutput | null,
    signals: readonly PmTelematicsSignal[] | null,
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
      workorder_id: schedule.pm_schedule_id,
      asset_id: schedule.asset_id,
      telematics_cluster,
      pm: "overdue",
      diagnostic: "none",
      asset_health: "none",
      usage: "none",
      environmental: "none",
      technician_notes: "none",
      compliance_block: false,
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
