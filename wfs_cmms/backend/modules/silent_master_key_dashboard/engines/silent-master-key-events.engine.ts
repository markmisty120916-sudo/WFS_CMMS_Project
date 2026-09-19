import type { SilentMasterKeyEventItem, SilentMasterKeyFilter } from "../silent-master-key-dashboard.interface";
import { asField, payloadRecord } from "../silent-master-key-dashboard.repository";

export function buildSilentMasterKeyEvents(
  tenant_id: string,
  events: readonly Readonly<Record<string, unknown>>[],
  filter: SilentMasterKeyFilter,
  allowed: (event_type: string) => boolean,
): readonly SilentMasterKeyEventItem[] {
  const items: SilentMasterKeyEventItem[] = [];
  let index = 0;
  while (index < events.length) {
    const row = events[index];
    if (asField(row, "tenant_id") === tenant_id) {
      const event_type = asField(row, "event_type");
      if (allowed(event_type) === true) {
        const payload = payloadRecord(row);
        const asset_id = asField(payload, "asset_id");
        const workorder_id = asField(payload, "workorder_id");
        let include = true;
        if (filter.asset !== "" && asset_id !== filter.asset) {
          include = false;
        }
        if (filter.workorder_id !== "" && workorder_id !== filter.workorder_id) {
          include = false;
        }
        if (include === true) {
          items.push(
            Object.freeze({
              tenant_id,
              event_id: asField(row, "event_id"),
              event_type,
              asset_id,
              workorder_id,
              reason: asField(payload, "reason") || asField(payload, "predictive_reason"),
              timestamp: asField(row, "timestamp"),
            }),
          );
        }
      }
    }
    index = index + 1;
  }
  return items;
}
