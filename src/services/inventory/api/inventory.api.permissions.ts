import type { DtoRole } from "../../../core/dto/base.dto";
import { canReadInventory, canWriteInventory } from "../inventory-rules";
import type { InventoryApiOperation } from "./inventory.api.contract";

export function isInventoryApiAllowed(operation: InventoryApiOperation, role: DtoRole): boolean {
  if (operation === "list_parts") {
    return canReadInventory(role);
  }
  if (operation === "get_part") {
    return canReadInventory(role);
  }
  if (operation === "create_part") {
    return canWriteInventory(role);
  }
  if (operation === "update_part") {
    return canWriteInventory(role);
  }
  if (operation === "delete_part") {
    return canWriteInventory(role);
  }
  if (operation === "get_inventory") {
    return canReadInventory(role);
  }
  if (operation === "adjust_stock") {
    return canWriteInventory(role);
  }
  if (operation === "reorder_part") {
    return canWriteInventory(role);
  }
  if (operation === "upsert_vendor") {
    return canWriteInventory(role);
  }
  if (operation === "list_requests") {
    return canReadInventory(role);
  }
  return false;
}
