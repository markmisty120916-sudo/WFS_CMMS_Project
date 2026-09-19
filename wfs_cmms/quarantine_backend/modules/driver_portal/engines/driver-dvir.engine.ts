import { matchesDriverAsset } from "../driver-portal-rules";
import type { DriverDvirItem, DriverPortalFilter } from "../driver-portal.interface";
import { asField } from "../driver-portal.repository";

export function buildDriverDvir(
  tenant_id: string,
  workorders: readonly Readonly<Record<string, unknown>>[],
  filter: DriverPortalFilter,
): readonly DriverDvirItem[] {
  const items: DriverDvirItem[] = [];
  let index = 0;
  while (index < workorders.length) {
    const row = workorders[index];
    if (asField(row, "tenant_id") === tenant_id) {
      if (asField(row, "source") === "dvir") {
        const asset_id = asField(row, "asset_id");
        if (matchesDriverAsset(asset_id, filter.asset) === true) {
          items.push(
            Object.freeze({
              tenant_id,
              dvir_id: asField(row, "workorder_id"),
              asset_id,
              description: asField(row, "description"),
              status: asField(row, "status"),
              created_at: asField(row, "created_at"),
            }),
          );
        }
      }
    }
    index = index + 1;
  }
  return items;
}
