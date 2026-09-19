import { TECHNICIAN_WORKFLOW_API_ROUTES } from "@/services/technician-workflow/api/technician-workflow.api.contract";
import { isTechnicianWorkflowApiAllowed } from "@/services/technician-workflow/api/technician-workflow.api.permissions";

export const ASSET_MANAGER_WORKFLOW_ROUTES = TECHNICIAN_WORKFLOW_API_ROUTES;
export { isTechnicianWorkflowApiAllowed as isAssetManagerWorkflowApiAllowed };
