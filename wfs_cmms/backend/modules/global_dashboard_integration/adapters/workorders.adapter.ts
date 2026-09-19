export function workordersSelectSql(bypass: boolean): string {
  if (bypass === true) {
    return "SELECT workorder_id, tenant_id, asset_id, source, description, severity, routing_tech_id, routing_bay_id, scheduled_start, scheduled_end, status, created_by, created_at, updated_at, deleted_at FROM Workorders WHERE deleted_at IS NULL";
  }
  return "SELECT workorder_id, tenant_id, asset_id, source, description, severity, routing_tech_id, routing_bay_id, scheduled_start, scheduled_end, status, created_by, created_at, updated_at, deleted_at FROM Workorders WHERE tenant_id = $1 AND deleted_at IS NULL";
}
