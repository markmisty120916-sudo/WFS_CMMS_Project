import type { FleetManagerFilter, FleetPmStatusItem } from "../fleet-manager-dashboard.interface";
import { asField } from "../fleet-manager-dashboard.repository";

export function buildPmStatus(
  tenant_id: string,
  schedules: readonly Readonly<Record<string, unknown>>[],
  filter: FleetManagerFilter,
): readonly FleetPmStatusItem[] {
  const items: FleetPmStatusItem[] = [];
  let index = 0;
  while (index < schedules.length) {
    const row = schedules[index];
    if (asField(row, "tenant_id") === tenant_id) {
      const status = asField(row, "status");
      const asset_group = asField(row, "asset_group");
      let include = true;
      if (filter.pm_status !== "" && status !== filter.pm_status) {
        include = false;
      }
      if (filter.asset_group !== "" && asset_group !== filter.asset_group) {
        include = false;
      }
      if (include === true) {
        items.push(
          Object.freeze({
            tenant_id,
            pm_schedule_id: asField(row, "pm_schedule_id"),
            asset_id: asField(row, "asset_id"),
            pm_template_id: asField(row, "pm_template_id"),
            status,
            asset_group,
            due_miles: asField(row, "due_miles"),
            due_hours: asField(row, "due_hours"),
          }),
        );
      }
    }
    index = index + 1;
  }
  return items;
}
