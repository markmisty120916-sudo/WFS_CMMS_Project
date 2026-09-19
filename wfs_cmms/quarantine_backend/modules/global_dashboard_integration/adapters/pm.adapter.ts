export function pmScheduleSelectSql(bypass: boolean): string {
  if (bypass === true) {
    return "SELECT pm_schedule_id, tenant_id, asset_id, pm_template_id, due_miles, due_hours, status, created_at, updated_at, deleted_at FROM PMSchedule WHERE deleted_at IS NULL";
  }
  return "SELECT pm_schedule_id, tenant_id, asset_id, pm_template_id, due_miles, due_hours, status, created_at, updated_at, deleted_at FROM PMSchedule WHERE tenant_id = $1 AND deleted_at IS NULL";
}

export function pmTemplateSelectSql(bypass: boolean): string {
  if (bypass === true) {
    return "SELECT pm_template_id, tenant_id, name, interval_miles, interval_hours, created_at, updated_at, deleted_at FROM PMTemplates WHERE deleted_at IS NULL";
  }
  return "SELECT pm_template_id, tenant_id, name, interval_miles, interval_hours, created_at, updated_at, deleted_at FROM PMTemplates WHERE tenant_id = $1 AND deleted_at IS NULL";
}
