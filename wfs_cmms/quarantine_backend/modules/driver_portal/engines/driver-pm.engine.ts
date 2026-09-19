import { matchesDriverAsset } from "../driver-portal-rules";
import type { DriverPmItem, DriverPortalFilter } from "../driver-portal.interface";
import { asField } from "../driver-portal.repository";

export function buildDriverPm(
  tenant_id: string,
  schedules: readonly Readonly<Record<string, unknown>>[],
  filter: DriverPortalFilter,
): readonly DriverPmItem[] {
  const items: DriverPmItem[] = [];
  let index = 0;
  while (index < schedules.length) {
    const row = schedules[index];
    if (asField(row, "tenant_id") === tenant_id) {
      const asset_id = asField(row, "asset_id");
      if (matchesDriverAsset(asset_id, filter.asset) === true) {
        const status = asField(row, "status");
        let pm_upcoming = "no";
        let pm_overdue = "no";
        if (status === "overdue") {
          pm_overdue = "yes";
        }
        if (status === "scheduled") {
          pm_upcoming = "yes";
        }
        if (status === "upcoming") {
          pm_upcoming = "yes";
        }
        items.push(
          Object.freeze({
            tenant_id,
            pm_schedule_id: asField(row, "pm_schedule_id"),
            asset_id,
            pm_type: asField(row, "pm_template_id"),
            pm_upcoming,
            pm_overdue,
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
