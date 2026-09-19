export function partsSelectSql(bypass: boolean): string {
  if (bypass === true) {
    return "SELECT part_id, tenant_id, name, description, quantity, location, created_at, updated_at, deleted_at FROM Parts WHERE deleted_at IS NULL";
  }
  return "SELECT part_id, tenant_id, name, description, quantity, location, created_at, updated_at, deleted_at FROM Parts WHERE tenant_id = $1 AND deleted_at IS NULL";
}

export function workorderPartsSelectSql(bypass: boolean): string {
  if (bypass === true) {
    return "SELECT part_usage_id, tenant_id, workorder_id, part_id, quantity, created_at, updated_at, deleted_at FROM WorkorderParts WHERE deleted_at IS NULL";
  }
  return "SELECT part_usage_id, tenant_id, workorder_id, part_id, quantity, created_at, updated_at, deleted_at FROM WorkorderParts WHERE tenant_id = $1 AND deleted_at IS NULL";
}
