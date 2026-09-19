import { ASSET_API_ROUTES } from "../../../../src/services/assets/api/asset.api.contract";
import { isAssetApiAllowed } from "../../../../src/services/assets/api/asset.api.permissions";

export const SILENT_MASTER_KEY_ASSETS_ROUTES = ASSET_API_ROUTES;
export { isAssetApiAllowed as isSilentMasterKeyAssetsApiAllowed };
