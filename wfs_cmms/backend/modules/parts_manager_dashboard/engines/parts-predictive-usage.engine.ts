import { isPartsPredictiveEventType } from "../adapters/aimi.adapter";
import type { PartsPredictiveItem } from "../parts-manager-dashboard.interface";
import { asField } from "../parts-manager-dashboard.repository";

function payloadRecord(row: Readonly<Record<string, unknown>>): Readonly<Record<string, unknown>> {
  const payload = row.payload;
  if (payload !== null && typeof payload === "object" && Array.isArray(payload) === false) {
    return payload as Record<string, unknown>;
  }
  return row;
}

export function buildPredictiveUsage(
  tenant_id: string,
  events: readonly Readonly<Record<string, unknown>>[],
): readonly PartsPredictiveItem[] {
  const items: PartsPredictiveItem[] = [];
  let index = 0;
  while (index < events.length) {
    const row = events[index];
    if (asField(row, "tenant_id") === tenant_id) {
      const event_type = asField(row, "event_type");
      if (isPartsPredictiveEventType(event_type) === true) {
        const payload = payloadRecord(row);
        items.push(
          Object.freeze({
            tenant_id,
            event_id: asField(row, "event_id"),
            event_type,
            part_id: asField(payload, "part_id"),
            workorder_id: asField(payload, "workorder_id"),
            reason: asField(payload, "reason") || asField(payload, "predictive_reason"),
            timestamp: asField(row, "timestamp"),
          }),
        );
      }
    }
    index = index + 1;
  }
  return items;
}
