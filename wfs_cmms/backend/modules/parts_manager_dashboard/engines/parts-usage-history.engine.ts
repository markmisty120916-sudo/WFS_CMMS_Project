import type { PartsManagerFilter, PartsUsageItem } from "../parts-manager-dashboard.interface";
import { asField } from "../parts-manager-dashboard.repository";

export function buildUsageHistory(
  tenant_id: string,
  usage: readonly Readonly<Record<string, unknown>>[],
  schedules: readonly Readonly<Record<string, unknown>>[],
  filter: PartsManagerFilter,
): readonly PartsUsageItem[] {
  const items: PartsUsageItem[] = [];
  let index = 0;
  while (index < usage.length) {
    const row = usage[index];
    if (asField(row, "tenant_id") === tenant_id) {
      const workorder_id = asField(row, "workorder_id");
      let usage_type = "workorder";
      let pmIndex = 0;
      while (pmIndex < schedules.length) {
        if (asField(schedules[pmIndex], "asset_id") !== "" && asField(schedules[pmIndex], "tenant_id") === tenant_id) {
          if (asField(schedules[pmIndex], "pm_schedule_id") === workorder_id) {
            usage_type = "pm";
          }
        }
        pmIndex = pmIndex + 1;
      }
      items.push(
        Object.freeze({
          tenant_id,
          part_usage_id: asField(row, "part_usage_id"),
          part_id: asField(row, "part_id"),
          workorder_id,
          quantity: asField(row, "quantity"),
          usage_type,
          created_at: asField(row, "created_at"),
        }),
      );
    }
    index = index + 1;
  }
  void filter;
  return items;
}
