import type { ContextDto } from "../../../core/dto/context.dto";
import type { RoutingOutput } from "../../../aimi/routing/routing-output.interface";
import { PartsRequestAimiAdapter } from "../adapters/parts-request-aimi.adapter";
import { PartsRequestInventoryAdapter } from "../adapters/parts-request-inventory.adapter";
import type { PartsRequest } from "../parts-request.interface";

export class PartsRequestRoutingEngine {
  private readonly aimiAdapter: PartsRequestAimiAdapter;
  private readonly inventoryAdapter: PartsRequestInventoryAdapter;

  constructor(aimiAdapter: PartsRequestAimiAdapter, inventoryAdapter: PartsRequestInventoryAdapter) {
    this.aimiAdapter = aimiAdapter;
    this.inventoryAdapter = inventoryAdapter;
  }

  async recommend(
    dto: ContextDto,
    request: PartsRequest,
    contextInput: unknown,
  ): Promise<RoutingOutput | null> {
    const workorder = await this.inventoryAdapter.loadWorkorder(request.workorder_id);
    return this.aimiAdapter.route(dto, request, workorder, contextInput);
  }
}
