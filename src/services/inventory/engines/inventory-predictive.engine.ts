import type { ContextDto } from "../../../core/dto/context.dto";
import type { PredictiveOutput } from "../../../aimi/predictive/predictive-output.interface";
import { InventoryAimiAdapter } from "../adapters/inventory-aimi.adapter";
import type { Part, StockAdjustment } from "../inventory.interface";

export class InventoryPredictiveEngine {
  private readonly adapter: InventoryAimiAdapter;

  constructor(adapter: InventoryAimiAdapter) {
    this.adapter = adapter;
  }

  async updateFromAdjustment(
    dto: ContextDto,
    part: Part,
    adjustment: StockAdjustment,
    workorder_id: string,
    contextInput: unknown,
  ): Promise<PredictiveOutput | null> {
    const usage = this.adapter.usageFromAdjustment(adjustment);
    return this.adapter.forecastOnStockAndUsage(dto, part, workorder_id, usage, contextInput);
  }

  async updateFromUsage(
    dto: ContextDto,
    part: Part,
    workorder_id: string,
    contextInput: unknown,
  ): Promise<PredictiveOutput | null> {
    return this.adapter.forecastOnStockAndUsage(dto, part, workorder_id, "moderate", contextInput);
  }
}
