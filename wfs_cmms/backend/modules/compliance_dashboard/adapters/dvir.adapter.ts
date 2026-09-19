import { DRIVER_DEFECT_API_ROUTES } from "@/services/driver-defect/api/driver-defect.api.contract";
import { isDriverDefectApiAllowed } from "@/services/driver-defect/api/driver-defect.api.permissions";

export const COMPLIANCE_DASHBOARD_DVIR_ROUTES = DRIVER_DEFECT_API_ROUTES;
export { isDriverDefectApiAllowed as isComplianceDashboardDvirApiAllowed };
