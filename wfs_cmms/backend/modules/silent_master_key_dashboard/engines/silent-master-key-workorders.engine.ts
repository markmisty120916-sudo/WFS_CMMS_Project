import type { SilentMasterKeyFilter, SilentMasterKeyWorkorderItem } from "../silent-master-key-dashboard.interface";
import { asField } from "../silent-master-key-dashboard.repository";

export function buildSilentMasterKeyWorkorders(
  tenant_id: string,
  workorders: readonly Readonly<Record<string, unknown>>[],
  filter: SilentMasterKeyFilter,
): readonly SilentMasterKeyWorkorderItem[] {
  const items: SilentMasterKeyWorkorderItem[] = [];
  let index = 0;
  while (index < workorders.length) {
    const row = workorders[index];
    if (asField(row, "tenant_id") === tenant_id) {
      const workorder_id = asField(row, "workorder_id");
      const asset_id = asField(row, "asset_id");
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
            workorder_id,
            asset_id,
            severity: asField(row, "severity"),
            routing_tech_id: asField(row, "routing_tech_id"),
            routing_bay_id: asField(row, "routing_bay_id"),
            scheduled_start: asField(row, "scheduled_start"),
            scheduled_end: asField(row, "scheduled_end"),
            status: asField(row, "status"),
          }),
        );
      }
    }
    index = index + 1;
  }
  return items;
}
