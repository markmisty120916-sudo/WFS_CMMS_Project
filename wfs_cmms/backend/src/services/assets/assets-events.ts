import type { Asset } from "./assets.interface";

export type AssetAuditAction = "asset.created" | "asset.updated";

export function assetAuditLogId(asset: Asset, action: AssetAuditAction): string {
  return asset.asset_id + ":assets:" + action + ":" + asset.updated_at;
}
