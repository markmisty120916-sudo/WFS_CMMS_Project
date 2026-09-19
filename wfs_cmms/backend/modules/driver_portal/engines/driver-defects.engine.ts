import { matchesDriverAsset } from "../driver-portal-rules";
import type { DriverDefectItem, DriverPortalFilter } from "../driver-portal.interface";
import { asField } from "../driver-portal.repository";
import { allowedDefectCategory } from "./driver-safe.engine";

export function buildDriverDefects(
  tenant_id: string,
  violations: readonly Readonly<Record<string, unknown>>[],
  filter: DriverPortalFilter,
): readonly DriverDefectItem[] {
  const items: DriverDefectItem[] = [];
  let index = 0;
  while (index < violations.length) {
    const row = violations[index];
    if (asField(row, "tenant_id") === tenant_id) {
      const asset_id = asField(row, "asset_id");
      if (matchesDriverAsset(asset_id, filter.asset) === true) {
        const description = asField(row, "description");
        items.push(
          Object.freeze({
            tenant_id,
            defect_id: asField(row, "violation_id"),
            asset_id,
            category: allowedDefectCategory(""),
            description,
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
