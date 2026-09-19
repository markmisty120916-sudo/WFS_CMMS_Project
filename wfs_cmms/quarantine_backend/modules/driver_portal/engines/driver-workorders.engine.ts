import { matchesDriverAsset } from "../driver-portal-rules";
import type { DriverPortalFilter, DriverWorkorderItem } from "../driver-portal.interface";
import { asField } from "../driver-portal.repository";
import { driverSafeScheduledWindow, driverSafeWorkorderSeverity, driverSafeWorkorderStatus } from "./driver-safe.engine";

export function buildDriverWorkorders(
  tenant_id: string,
  workorders: readonly Readonly<Record<string, unknown>>[],
  filter: DriverPortalFilter,
): readonly DriverWorkorderItem[] {
  const items: DriverWorkorderItem[] = [];
  let index = 0;
  while (index < workorders.length) {
    const row = workorders[index];
    if (asField(row, "tenant_id") === tenant_id) {
      if (asField(row, "source") === "driver") {
        const asset_id = asField(row, "asset_id");
        if (matchesDriverAsset(asset_id, filter.asset) === true) {
          items.push(
            Object.freeze({
              tenant_id,
              workorder_id: asField(row, "workorder_id"),
              asset_id,
              status: driverSafeWorkorderStatus(asField(row, "status")),
              severity: driverSafeWorkorderSeverity(asField(row, "severity")),
              scheduled_window: driverSafeScheduledWindow(
                asField(row, "scheduled_start"),
                asField(row, "scheduled_end"),
              ),
            }),
          );
        }
      }
    }
    index = index + 1;
  }
  return items;
}
