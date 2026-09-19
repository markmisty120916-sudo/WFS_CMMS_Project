import type { ComplianceDashboardFilter, ComplianceDotItem } from "../compliance-dashboard.interface";
import { asField } from "../compliance-dashboard.repository";
import { matchesInspectionFilters } from "./compliance-inspection-match";

export function buildDotCompliance(
  tenant_id: string,
  inspections: readonly Readonly<Record<string, unknown>>[],
  filter: ComplianceDashboardFilter,
): readonly ComplianceDotItem[] {
  const items: ComplianceDotItem[] = [];
  let index = 0;
  while (index < inspections.length) {
    const row = inspections[index];
    if (matchesInspectionFilters(tenant_id, row, filter) === true && asField(row, "type") === "DOT") {
      items.push(
        Object.freeze({
          tenant_id,
          inspection_id: asField(row, "inspection_id"),
          asset_id: asField(row, "asset_id"),
          type: asField(row, "type"),
          status: asField(row, "status"),
        }),
      );
    }
    index = index + 1;
  }
  return items;
}
