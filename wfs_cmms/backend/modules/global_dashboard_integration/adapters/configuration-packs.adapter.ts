export function configurationPacksSelectSql(bypass: boolean): string {
  if (bypass === true) {
    return "SELECT pack_id, tenant_id, name, pm_template_name, interval_miles, interval_hours, severity_default, workorder_source, telematics_fault_code, telematics_severity, created_at, updated_at, deleted_at FROM ConfigurationPacks WHERE deleted_at IS NULL";
  }
  return "SELECT pack_id, tenant_id, name, pm_template_name, interval_miles, interval_hours, severity_default, workorder_source, telematics_fault_code, telematics_severity, created_at, updated_at, deleted_at FROM ConfigurationPacks WHERE tenant_id = $1 AND deleted_at IS NULL";
}

export function importHistorySelectSql(bypass: boolean): string {
  if (bypass === true) {
    return "SELECT import_id, tenant_id, data_type, file_format, status, created_by, audit_summary, row_payload, created_at, updated_at, deleted_at FROM ImportHistory WHERE deleted_at IS NULL";
  }
  return "SELECT import_id, tenant_id, data_type, file_format, status, created_by, audit_summary, row_payload, created_at, updated_at, deleted_at FROM ImportHistory WHERE tenant_id = $1 AND deleted_at IS NULL";
}
