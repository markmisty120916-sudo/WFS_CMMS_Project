import { freezeStockLevel, type Part, type StockLevel } from "../inventory.interface";
import { isAtOrBelow } from "../utils/inventory-normalizer";

export class InventoryLevelsEngine {
  build(part: Part, reorder_point: string): StockLevel {
    return freezeStockLevel({
      tenant_id: part.tenant_id,
      part_id: part.part_id,
      quantity: part.quantity,
      location: part.location,
      reorder_point,
      needed: isAtOrBelow(part.quantity, reorder_point),
    });
  }

  buildList(parts: readonly Part[], reorder_point: string): readonly StockLevel[] {
    const levels: StockLevel[] = [];
    let index = 0;
    while (index < parts.length) {
      levels.push(this.build(parts[index], reorder_point));
      index = index + 1;
    }
    return levels;
  }
}
