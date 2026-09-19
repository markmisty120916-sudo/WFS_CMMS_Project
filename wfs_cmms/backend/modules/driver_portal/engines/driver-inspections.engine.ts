import { matchesDriverAsset } from "../driver-portal-rules";
import type { DriverInspectionItem, DriverPortalFilter } from "../driver-portal.interface";
import { asField } from "../driver-portal.repository";

export function buildDriverInspections(
  tenant_id: string,
  inspections: readonly Readonly<Record<string, unknown>>[],
  filter: DriverPortalFilter,
): readonly DriverInspectionItem[] {
  const items: DriverInspectionItem[] = [];
  let index = 0;
  while (index < inspections.length) {
    const row = inspections[index];
    if (asField(row, "tenant_id") === tenant_id) {
      const asset_id = asField(row, "asset_id");
      if (matchesDriverAsset(asset_id, filter.asset) === true) {
        items.push(
          Object.freeze({
            tenant_id,
            inspection_id: asField(row, "inspection_id"),
            asset_id,
            type: asField(row, "type"),
            status: asField(row, "status"),
            created_at: asField(row, "created_at"),
          }),
        );
      }
    }
    index = index + 1;
  }
  return items;
}
