export function inspectionsSelectSql(bypass: boolean): string {
  if (bypass === true) {
    return "SELECT inspection_id, tenant_id, asset_id, type, status, created_at, updated_at, deleted_at FROM ComplianceInspections WHERE deleted_at IS NULL";
  }
  return "SELECT inspection_id, tenant_id, asset_id, type, status, created_at, updated_at, deleted_at FROM ComplianceInspections WHERE tenant_id = $1 AND deleted_at IS NULL";
}

export function violationsSelectSql(bypass: boolean): string {
  if (bypass === true) {
    return "SELECT violation_id, tenant_id, asset_id, description, severity, status, created_at, updated_at, deleted_at FROM ComplianceViolations WHERE deleted_at IS NULL";
  }
  return "SELECT violation_id, tenant_id, asset_id, description, severity, status, created_at, updated_at, deleted_at FROM ComplianceViolations WHERE tenant_id = $1 AND deleted_at IS NULL";
}
