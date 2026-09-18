import type { ComplianceDashboardFilter, ComplianceOverview } from "../compliance-dashboard.interface";
import { matchesInspectionFilters, toInspectionItem } from "./compliance-inspection-match";

export function buildComplianceOverview(
  tenant_id: string,
  inspections: readonly Readonly<Record<string, unknown>>[],
  filter: ComplianceDashboardFilter,
): ComplianceOverview {
  const items = [];
  let open_count = 0;
  let overdue_count = 0;
  let upcoming_count = 0;
  let index = 0;
  while (index < inspections.length) {
    const row = inspections[index];
    if (matchesInspectionFilters(tenant_id, row, filter) === true) {
      const item = toInspectionItem(tenant_id, row);
      if (item.status !== "passed" && item.status !== "failed") {
        open_count = open_count + 1;
      }
      if (item.status === "overdue") {
        overdue_count = overdue_count + 1;
      }
      if (item.status === "scheduled") {
        upcoming_count = upcoming_count + 1;
      }
      items.push(item);
    }
    index = index + 1;
  }
  return Object.freeze({
    tenant_id,
    open_count: String(open_count),
    overdue_count: String(overdue_count),
    upcoming_count: String(upcoming_count),
    items,
  });
}
