import type { ContextDto } from "../../../core/dto/context.dto";
import type { PredictiveOutput } from "../../../aimi/predictive/predictive-output.interface";
import { PartsRequestAimiAdapter } from "../adapters/parts-request-aimi.adapter";
import { PartsRequestInventoryAdapter } from "../adapters/parts-request-inventory.adapter";
import type { PartsRequest } from "../parts-request.interface";

export class PartsRequestPredictiveEngine {
  private readonly aimiAdapter: PartsRequestAimiAdapter;
  private readonly inventoryAdapter: PartsRequestInventoryAdapter;

  constructor(aimiAdapter: PartsRequestAimiAdapter, inventoryAdapter: PartsRequestInventoryAdapter) {
    this.aimiAdapter = aimiAdapter;
    this.inventoryAdapter = inventoryAdapter;
  }

  async forecast(
    dto: ContextDto,
    request: PartsRequest,
    contextInput: unknown,
  ): Promise<PredictiveOutput | null> {
    const workorder = await this.inventoryAdapter.loadWorkorder(request.workorder_id);
    return this.aimiAdapter.forecast(dto, request, workorder, contextInput);
  }
}
