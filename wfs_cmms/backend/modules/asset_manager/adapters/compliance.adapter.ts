import { COMPLIANCE_API_ROUTES } from "@/services/compliance/api/compliance.api.contract";
import { isComplianceApiAllowed } from "@/services/compliance/api/compliance.api.permissions";

export const ASSET_MANAGER_COMPLIANCE_ROUTES = COMPLIANCE_API_ROUTES;
export { isComplianceApiAllowed as isAssetManagerComplianceApiAllowed };
