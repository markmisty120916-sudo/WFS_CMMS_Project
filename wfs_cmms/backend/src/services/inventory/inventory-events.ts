import type { IncomingEvent } from "../../core/event-bus/event.interface";
import type { ContextDto } from "../../core/dto/context.dto";
import type { Part, Reorder } from "./inventory.interface";

export type InventoryAuditAction =
  | "inventory.part.created"
  | "inventory.part.updated"
  | "inventory.part.deleted"
  | "inventory.stock.adjusted"
  | "inventory.reorder.created";

export function inventoryAuditLogId(
  entity_id: string,
  action: InventoryAuditAction,
  timestamp: string,
): string {
  return entity_id + ":inventory:" + action + ":" + timestamp;
}

export function incomingEventFromVendorOrder(
  dto: ContextDto,
  part: Part,
  reorder: Reorder,
): IncomingEvent {
  return {
    event_id: inventoryAuditLogId(reorder.request_id, "inventory.reorder.created", dto.timestamp),
    event_type: "inventory.vendor.order.created",
    event_category: "inventory",
    event_source: "inventory-service",
    event_payload: {
      part_id: part.part_id,
      request_id: reorder.request_id,
      quantity: reorder.quantity,
      vendor_name: reorder.vendor_name,
      action: "inventory.reorder.created",
    },
    tenant_id: dto.tenant_id,
    user_id: dto.user_id,
    role: dto.role,
    timestamp: dto.timestamp,
  };
}

export function inventoryPartEntityId(part: Part): string {
  return part.part_id;
}
