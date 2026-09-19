export function vendorsSelectSql(bypass: boolean): string {
  if (bypass === true) {
    return "SELECT vendor_id, tenant_id, vendor_name, location, created_at, updated_at, deleted_at FROM Vendors WHERE deleted_at IS NULL";
  }
  return "SELECT vendor_id, tenant_id, vendor_name, location, created_at, updated_at, deleted_at FROM Vendors WHERE tenant_id = $1 AND deleted_at IS NULL";
}
