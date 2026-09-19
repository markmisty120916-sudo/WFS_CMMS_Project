import { ASSET_API_ROUTES } from "../../../../src/services/assets/api/asset.api.contract";
import { isAssetApiAllowed } from "../../../../src/services/assets/api/asset.api.permissions";

export const FLEET_MANAGER_ASSETS_ROUTES = ASSET_API_ROUTES;
export { isAssetApiAllowed as isFleetManagerAssetsApiAllowed };
