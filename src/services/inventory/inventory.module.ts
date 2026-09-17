import { InventoryService, type InventoryServiceOptions } from "./inventory.service";

export class InventoryModule {
  static create(options: InventoryServiceOptions): InventoryService {
    return new InventoryService(options);
  }
}

export { InventoryService } from "./inventory.service";
export type { InventoryServiceOptions } from "./inventory.service";
