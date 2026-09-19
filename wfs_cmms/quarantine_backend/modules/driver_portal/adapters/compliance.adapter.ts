import { COMPLIANCE_API_ROUTES } from "../../../../src/services/compliance/api/compliance.api.contract";
import { isComplianceApiAllowed } from "../../../../src/services/compliance/api/compliance.api.permissions";

export const DRIVER_PORTAL_COMPLIANCE_ROUTES = COMPLIANCE_API_ROUTES;
export { isComplianceApiAllowed as isDriverPortalComplianceApiAllowed };
