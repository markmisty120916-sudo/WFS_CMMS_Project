import type { ComplianceDashboardFilter, ComplianceInspectionItem } from "../compliance-dashboard.interface";
import { matchesComplianceCategory } from "../compliance-dashboard-rules";
import { asField } from "../compliance-dashboard.repository";

export function isInspectionInstanceStatus(status: string): boolean {
  if (status === "template") {
    return false;
  }
  return true;
}

export function matchesInspectionFilters(
  tenant_id: string,
  row: Readonly<Record<string, unknown>>,
  filter: ComplianceDashboardFilter,
): boolean {
  if (asField(row, "tenant_id") !== tenant_id) {
    return false;
  }
  if (isInspectionInstanceStatus(asField(row, "status")) === false) {
    return false;
  }
  if (filter.asset !== "" && asField(row, "asset_id") !== filter.asset) {
    return false;
  }
  if (filter.inspection_type !== "" && asField(row, "type") !== filter.inspection_type) {
    return false;
  }
  if (matchesComplianceCategory(asField(row, "type"), filter.compliance_category) === false) {
    return false;
  }
  return true;
}

export function toInspectionItem(tenant_id: string, row: Readonly<Record<string, unknown>>): ComplianceInspectionItem {
  return Object.freeze({
    tenant_id,
    inspection_id: asField(row, "inspection_id"),
    asset_id: asField(row, "asset_id"),
    type: asField(row, "type"),
    status: asField(row, "status"),
    created_at: asField(row, "created_at"),
  });
}
