import { PARTS_MANAGER_EVENT_TYPES } from "../parts-manager-dashboard-events";
import type { PartsAlertItem, PartsAwaitingItem, PartsInventoryOverview } from "../parts-manager-dashboard.interface";
import { asField } from "../parts-manager-dashboard.repository";

function payloadRecord(row: Readonly<Record<string, unknown>>): Readonly<Record<string, unknown>> {
  const payload = row.payload;
  if (payload !== null && typeof payload === "object" && Array.isArray(payload) === false) {
    return payload as Record<string, unknown>;
  }
  return row;
}

export function buildAlerts(
  tenant_id: string,
  overview: PartsInventoryOverview,
  awaiting: readonly PartsAwaitingItem[],
  events: readonly Readonly<Record<string, unknown>>[],
): readonly PartsAlertItem[] {
  const items: PartsAlertItem[] = [];
  let index = 0;
  while (index < overview.items.length) {
    const part = overview.items[index];
    if (part.stock_status === "critical") {
      items.push(
        Object.freeze({
          tenant_id,
          alert_type: "low stock",
          part_id: part.part_id,
          workorder_id: "",
          vendor_name: part.vendor_name,
          message: "critical",
        }),
      );
    }
    if (part.stock_status === "reorder") {
      items.push(
        Object.freeze({
          tenant_id,
          alert_type: "reorder required",
          part_id: part.part_id,
          workorder_id: "",
          vendor_name: part.vendor_name,
          message: "reorder",
        }),
      );
    }
    index = index + 1;
  }
  let waitIndex = 0;
  while (waitIndex < awaiting.length) {
    items.push(
      Object.freeze({
        tenant_id,
        alert_type: "awaiting parts",
        part_id: awaiting[waitIndex].part_id,
        workorder_id: awaiting[waitIndex].workorder_id,
        vendor_name: "",
        message: awaiting[waitIndex].status,
      }),
    );
    waitIndex = waitIndex + 1;
  }
  let eventIndex = 0;
  while (eventIndex < events.length) {
    const row = events[eventIndex];
    if (asField(row, "tenant_id") === tenant_id && asField(row, "event_type") === PARTS_MANAGER_EVENT_TYPES.inventory_vendor_order_created) {
      const payload = payloadRecord(row);
      items.push(
        Object.freeze({
          tenant_id,
          alert_type: "vendor delays",
          part_id: asField(payload, "part_id"),
          workorder_id: "",
          vendor_name: asField(payload, "vendor_name"),
          message: PARTS_MANAGER_EVENT_TYPES.inventory_vendor_order_created,
        }),
      );
    }
    eventIndex = eventIndex + 1;
  }
  return items;
}
