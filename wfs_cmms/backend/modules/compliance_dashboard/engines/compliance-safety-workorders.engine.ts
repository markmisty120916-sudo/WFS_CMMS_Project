import type { ComplianceDashboardFilter, ComplianceSafetyWorkorderItem } from "../compliance-dashboard.interface";
import { asField } from "../compliance-dashboard.repository";

export function buildSafetyWorkorders(
  tenant_id: string,
  workorders: readonly Readonly<Record<string, unknown>>[],
  filter: ComplianceDashboardFilter,
): readonly ComplianceSafetyWorkorderItem[] {
  const items: ComplianceSafetyWorkorderItem[] = [];
  let index = 0;
  while (index < workorders.length) {
    const row = workorders[index];
    if (asField(row, "tenant_id") === tenant_id && asField(row, "source") === "compliance") {
      let include = true;
      if (filter.asset !== "" && asField(row, "asset_id") !== filter.asset) {
        include = false;
      }
      if (filter.severity !== "" && asField(row, "severity") !== filter.severity) {
        include = false;
      }
      if (filter.technician !== "" && asField(row, "routing_tech_id") !== filter.technician) {
        include = false;
      }
      if (filter.driver !== "" && asField(row, "created_by") !== filter.driver) {
        include = false;
      }
      if (include === true) {
        items.push(
          Object.freeze({
            tenant_id,
            workorder_id: asField(row, "workorder_id"),
            asset_id: asField(row, "asset_id"),
            description: asField(row, "description"),
            severity: asField(row, "severity"),
            status: asField(row, "status"),
            routing_tech_id: asField(row, "routing_tech_id"),
            created_by: asField(row, "created_by"),
          }),
        );
      }
    }
    index = index + 1;
  }
  return items;
}
