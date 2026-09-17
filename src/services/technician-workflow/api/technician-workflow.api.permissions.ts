import type { DtoRole } from "../../../core/dto/base.dto";
import { canReadTechnicianWorkflow, canWriteTechnicianWorkflow } from "../technician-workflow-rules";
import type { TechnicianWorkflowApiOperation } from "./technician-workflow.api.contract";

export function isTechnicianWorkflowApiAllowed(
  operation: TechnicianWorkflowApiOperation,
  role: DtoRole,
): boolean {
  if (operation === "list_workflows") {
    return canReadTechnicianWorkflow(role);
  }
  if (operation === "get_workflow") {
    return canReadTechnicianWorkflow(role);
  }
  if (operation === "start_workflow") {
    return canWriteTechnicianWorkflow(role);
  }
  if (operation === "update_step") {
    return canWriteTechnicianWorkflow(role);
  }
  if (operation === "complete_workflow") {
    return canWriteTechnicianWorkflow(role);
  }
  if (operation === "technician_action") {
    return canWriteTechnicianWorkflow(role);
  }
  return false;
}
