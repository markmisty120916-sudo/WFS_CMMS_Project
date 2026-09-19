export const FIND_VEHICLE_LABEL = "Find Vehicle" as const;

export function telematicsSelectSql(bypass: boolean): string {
  if (bypass === true) {
    return "SELECT telematics_id, tenant_id, asset_id, fault_code, fault_description, severity, timestamp, created_at, updated_at, deleted_at FROM AssetTelematics WHERE deleted_at IS NULL";
  }
  return "SELECT telematics_id, tenant_id, asset_id, fault_code, fault_description, severity, timestamp, created_at, updated_at, deleted_at FROM AssetTelematics WHERE tenant_id = $1 AND deleted_at IS NULL";
}

export function telematicsChannel(fault_code: string, fault_description: string, is_latest: boolean): "gps" | "can" | "obd" | "breadcrumbs" {
  const code = fault_code.toUpperCase();
  const description = fault_description.toUpperCase();
  if (description.indexOf("CAN") >= 0 || code.indexOf("CAN") >= 0) {
    return "can";
  }
  if (
    code.indexOf("OBD") >= 0 ||
    description.indexOf("OBD") >= 0 ||
    code.indexOf("P0") === 0 ||
    code.indexOf("C0") === 0 ||
    code.indexOf("B0") === 0 ||
    code.indexOf("U0") === 0
  ) {
    return "obd";
  }
  if (is_latest === true) {
    return "gps";
  }
  return "breadcrumbs";
}
