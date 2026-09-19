import { TECHNICIAN_WORKFLOW_API_ROUTES } from "../../../../src/services/technician-workflow/api/technician-workflow.api.contract";
import { isTechnicianWorkflowApiAllowed } from "../../../../src/services/technician-workflow/api/technician-workflow.api.permissions";

export const FLEET_MANAGER_WORKORDER_ROUTES = TECHNICIAN_WORKFLOW_API_ROUTES;
export { isTechnicianWorkflowApiAllowed as isFleetManagerWorkorderApiAllowed };
