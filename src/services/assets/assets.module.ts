/**
 * Assets Service
 * Master Blueprint V2 / architecture.md §3.2 / BACKEND-STRUCTURE §5 / verticals.md §2
 * Factory only. No Nest runtime. No global Assets instance.
 */

import { AssetsService, type AssetsServiceOptions } from "./assets.service";

export class AssetsModule {
  static create(options: AssetsServiceOptions): AssetsService {
    return new AssetsService(options);
  }
}

export { AssetsService } from "./assets.service";
export type { AssetsServiceOptions } from "./assets.service";
export type {
  Asset,
  AssetDetail,
  AssetHealth,
  AssetListQuery,
  AssetListResult,
  AssetTelematics,
  AssetWriteInput,
} from "./assets.interface";
export {
  freezeAsset,
  freezeAssetDetail,
  freezeAssetHealth,
  freezeAssetListResult,
  freezeAssetTelematics,
} from "./assets.interface";
export {
  buildAssetForCreate,
  buildAssetForSoftDelete,
  buildAssetForUpdate,
  buildAssetFromRow,
  buildAssetHealthFromRow,
  buildAssetTelematicsFromRow,
  parseAssetListQuery,
  parseAssetWriteInput,
} from "./assets-builder";
export type { AssetsBuildResult } from "./assets-builder";
export {
  assetListError,
  assetReadError,
  assetTenantError,
  assetWriteError,
  canViewAllAssets,
  canViewAssetDetails,
  canViewAssignedAsset,
  canWriteAsset,
} from "./assets-rules";
export { assetAuditLogId } from "./assets-events";
export type { AssetAuditAction } from "./assets-events";
