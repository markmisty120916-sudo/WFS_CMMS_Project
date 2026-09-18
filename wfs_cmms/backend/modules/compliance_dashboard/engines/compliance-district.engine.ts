import type { ComplianceDashboardFilter, ComplianceDistrictItem } from "../compliance-dashboard.interface";
import { asField } from "../compliance-dashboard.repository";
import { matchesInspectionFilters } from "./compliance-inspection-match";

export function buildDistrictCompliance(
  tenant_id: string,
  inspections: readonly Readonly<Record<string, unknown>>[],
  filter: ComplianceDashboardFilter,
): readonly ComplianceDistrictItem[] {
  const items: ComplianceDistrictItem[] = [];
  let index = 0;
  while (index < inspections.length) {
    const row = inspections[index];
    if (matchesInspectionFilters(tenant_id, row, filter) === true && asField(row, "type") === "school_district") {
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
