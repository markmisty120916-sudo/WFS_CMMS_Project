/**
 * Assets Service
 * Master Blueprint V2 / BACKEND-STRUCTURE §7 / EVENT-BUS-SPEC
 * Audit identity for asset.updated. EventBus whitelist is not extended here.
 */

import type { Asset } from "./assets.interface";

export type AssetAuditAction = "asset.updated";

export function assetAuditLogId(
  asset: Asset,
  action: AssetAuditAction,
): string {
  return asset.asset_id + ":assets:" + action + ":" + asset.updated_at;
}
