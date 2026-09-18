import type { ComplianceDashboardFilter, ComplianceFindingItem } from "../compliance-dashboard.interface";
import { asField } from "../compliance-dashboard.repository";
import { matchesInspectionFilters } from "./compliance-inspection-match";

export function buildComplianceFindings(
  tenant_id: string,
  inspections: readonly Readonly<Record<string, unknown>>[],
  filter: ComplianceDashboardFilter,
): readonly ComplianceFindingItem[] {
  const failed: Readonly<Record<string, unknown>>[] = [];
  const counts: Record<string, number> = {};
  let index = 0;
  while (index < inspections.length) {
    const row = inspections[index];
    if (matchesInspectionFilters(tenant_id, row, filter) === true && asField(row, "status") === "failed") {
      const asset_id = asField(row, "asset_id");
      if (counts[asset_id] === undefined) {
        counts[asset_id] = 0;
      }
      counts[asset_id] = counts[asset_id] + 1;
      failed.push(row);
    }
    index = index + 1;
  }
  const items: ComplianceFindingItem[] = [];
  let failedIndex = 0;
  while (failedIndex < failed.length) {
    const row = failed[failedIndex];
    const asset_id = asField(row, "asset_id");
    let repeat_offender = "false";
    if (counts[asset_id] > 1) {
      repeat_offender = "true";
    }
    items.push(
      Object.freeze({
        tenant_id,
        inspection_id: asField(row, "inspection_id"),
        asset_id,
        status: asField(row, "status"),
        severity: asField(row, "severity"),
        repeat_offender,
      }),
    );
    failedIndex = failedIndex + 1;
  }
  return items;
}
