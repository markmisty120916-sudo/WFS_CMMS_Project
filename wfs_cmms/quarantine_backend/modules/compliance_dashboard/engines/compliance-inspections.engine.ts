import type { ComplianceDashboardFilter, ComplianceInspectionItem } from "../compliance-dashboard.interface";
import { matchesInspectionFilters, toInspectionItem } from "./compliance-inspection-match";

export function buildComplianceInspections(
  tenant_id: string,
  inspections: readonly Readonly<Record<string, unknown>>[],
  filter: ComplianceDashboardFilter,
): readonly ComplianceInspectionItem[] {
  const items: ComplianceInspectionItem[] = [];
  let index = 0;
  while (index < inspections.length) {
    if (matchesInspectionFilters(tenant_id, inspections[index], filter) === true) {
      items.push(toInspectionItem(tenant_id, inspections[index]));
    }
    index = index + 1;
  }
  return items;
}
