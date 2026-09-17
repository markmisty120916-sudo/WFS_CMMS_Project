import { PartsRequestInventoryAdapter } from "../adapters/parts-request-inventory.adapter";
import type { PartsAvailability, PartsRequest } from "../parts-request.interface";

export class PartsRequestAvailabilityEngine {
  private readonly adapter: PartsRequestInventoryAdapter;

  constructor(adapter: PartsRequestInventoryAdapter) {
    this.adapter = adapter;
  }

  async check(request: PartsRequest): Promise<PartsAvailability> {
    const on_hand = await this.adapter.loadQuantity(request.part_id);
    let quantity_on_hand = "";
    if (on_hand !== null) {
      quantity_on_hand = on_hand;
    }
    return this.adapter.availability(request.part_id, quantity_on_hand, request.quantity);
  }
}
