export const ASSETS_TABLE = "Assets";
export const ASSET_HEALTH_TABLE = "AssetHealth";

export function assetsSelectSql(bypass: boolean): string {
  if (bypass === true) {
    return "SELECT asset_id, tenant_id, vin, unit_number, make, model, year, mileage, hours, status, created_at, updated_at, deleted_at FROM Assets WHERE deleted_at IS NULL";
  }
  return "SELECT asset_id, tenant_id, vin, unit_number, make, model, year, mileage, hours, status, created_at, updated_at, deleted_at FROM Assets WHERE tenant_id = $1 AND deleted_at IS NULL";
}

export function assetHealthSelectSql(bypass: boolean): string {
  if (bypass === true) {
    return "SELECT health_id, tenant_id, asset_id, health_score, predictive_score, last_update, created_at, updated_at, deleted_at FROM AssetHealth WHERE deleted_at IS NULL";
  }
  return "SELECT health_id, tenant_id, asset_id, health_score, predictive_score, last_update, created_at, updated_at, deleted_at FROM AssetHealth WHERE tenant_id = $1 AND deleted_at IS NULL";
}
