import { ASSET_API_ROUTES } from "../../../../src/services/assets/api/asset.api.contract";
import { isAssetApiAllowed } from "../../../../src/services/assets/api/asset.api.permissions";

export const COMPLIANCE_DASHBOARD_ASSETS_ROUTES = ASSET_API_ROUTES;
export { isAssetApiAllowed as isComplianceDashboardAssetsApiAllowed };
