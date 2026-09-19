import type { ContextDto } from "../../../core/dto/context.dto";
import type { PredictiveEngineService } from "../../../aimi/predictive/predictive-engine.service";
import type { PredictiveInputs } from "../../../aimi/predictive/predictive-inputs.interface";
import type { PredictiveOutput } from "../../../aimi/predictive/predictive-output.interface";
import { isRoleAllowedToForecast } from "../../../aimi/predictive/predictive-rules";
import type { Part, StockAdjustment } from "../inventory.interface";
import { asFiniteNumber } from "../utils/inventory-normalizer";

export class InventoryAimiAdapter {
  private readonly predictiveEngine: PredictiveEngineService;

  constructor(predictiveEngine: PredictiveEngineService) {
    this.predictiveEngine = predictiveEngine;
  }

  usageFromAdjustment(adjustment: StockAdjustment): PredictiveInputs["usage"] {
    const change = asFiniteNumber(adjustment.delta);
    if (change === null) {
      return "none";
    }
    if (change < 0) {
      return "moderate";
    }
    return "none";
  }

  async forecastOnStockAndUsage(
    dto: ContextDto,
    part: Part,
    workorder_id: string,
    usage: PredictiveInputs["usage"],
    contextInput: unknown,
  ): Promise<PredictiveOutput | null> {
    if (isRoleAllowedToForecast(dto.role) === false) {
      return null;
    }
    let bound_workorder_id = workorder_id;
    if (bound_workorder_id === "") {
      bound_workorder_id = part.part_id;
    }
    const inputs: PredictiveInputs = {
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      timestamp: dto.timestamp,
      workorder_id: bound_workorder_id,
      asset_id: part.part_id,
      telematics_cluster: "none",
      pm: "none",
      diagnostic: "none",
      asset_health: "none",
      usage,
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
}
