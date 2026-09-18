import type { ComplianceDashboardFilter, ComplianceDvirItem } from "../compliance-dashboard.interface";
import { asField } from "../compliance-dashboard.repository";

export function buildComplianceDvir(
  tenant_id: string,
  violations: readonly Readonly<Record<string, unknown>>[],
  filter: ComplianceDashboardFilter,
): readonly ComplianceDvirItem[] {
  const items: ComplianceDvirItem[] = [];
  let index = 0;
  while (index < violations.length) {
    const row = violations[index];
    if (asField(row, "tenant_id") === tenant_id) {
      let include = true;
      if (filter.asset !== "" && asField(row, "asset_id") !== filter.asset) {
        include = false;
      }
      if (filter.severity !== "" && asField(row, "severity") !== filter.severity) {
        include = false;
      }
      if (include === true) {
        items.push(
          Object.freeze({
            tenant_id,
            violation_id: asField(row, "violation_id"),
            asset_id: asField(row, "asset_id"),
            description: asField(row, "description"),
            severity: asField(row, "severity"),
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
