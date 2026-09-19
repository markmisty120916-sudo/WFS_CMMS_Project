export const TECHNICIAN_WORKFLOW_API_BASE = "/v1/workorders";

export const TECHNICIAN_WORKFLOW_API_HEADERS = Object.freeze({
  authorization: "Authorization",
  tenant: "X-Tenant-Id",
  content_type: "Content-Type",
});

export type TechnicianWorkflowApiMethod = "GET" | "POST";

export type TechnicianWorkflowApiOperation =
  | "list_workflows"
  | "get_workflow"
  | "start_workflow"
  | "update_step"
  | "complete_workflow"
  | "technician_action";

export type TechnicianWorkflowApiRoute = {
  readonly method: TechnicianWorkflowApiMethod;
  readonly path: string;
  readonly operation: TechnicianWorkflowApiOperation;
};

export const TECHNICIAN_WORKFLOW_API_ROUTES: readonly TechnicianWorkflowApiRoute[] = Object.freeze([
  Object.freeze({
    method: "GET" as const,
    path: "/workorders",
    operation: "list_workflows" as const,
  }),
  Object.freeze({
    method: "GET" as const,
    path: "/workorders/{workorder_id}/workflow",
    operation: "get_workflow" as const,
  }),
  Object.freeze({
    method: "POST" as const,
    path: "/workorders/{workorder_id}/workflow/start",
    operation: "start_workflow" as const,
  }),
  Object.freeze({
    method: "POST" as const,
    path: "/workorders/{workorder_id}/workflow/steps",
    operation: "update_step" as const,
  }),
  Object.freeze({
    method: "POST" as const,
    path: "/workorders/{workorder_id}/workflow/complete",
    operation: "complete_workflow" as const,
  }),
  Object.freeze({
    method: "POST" as const,
    path: "/workorders/{workorder_id}/workflow/actions",
    operation: "technician_action" as const,
  }),
]);
