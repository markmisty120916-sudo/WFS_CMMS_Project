export const PM_API_BASE = "/v1/pm";

export const PM_API_HEADERS = Object.freeze({
  authorization: "Authorization",
  tenant: "X-Tenant-Id",
  content_type: "Content-Type",
});

export type PmApiMethod = "GET" | "POST" | "PUT" | "DELETE";

export type PmApiOperation =
  | "list_templates"
  | "create_template"
  | "update_template"
  | "delete_template"
  | "list_schedules"
  | "create_instance"
  | "complete";

export type PmApiRoute = {
  readonly method: PmApiMethod;
  readonly path: string;
  readonly operation: PmApiOperation;
};

export const PM_API_ROUTES: readonly PmApiRoute[] = Object.freeze([
  Object.freeze({
    method: "GET" as const,
    path: "/pm/templates",
    operation: "list_templates" as const,
  }),
  Object.freeze({
    method: "POST" as const,
    path: "/pm/templates",
    operation: "create_template" as const,
  }),
  Object.freeze({
    method: "PUT" as const,
    path: "/pm/templates/{pm_template_id}",
    operation: "update_template" as const,
  }),
  Object.freeze({
    method: "DELETE" as const,
    path: "/pm/templates/{pm_template_id}",
    operation: "delete_template" as const,
  }),
  Object.freeze({
    method: "GET" as const,
    path: "/pm/schedules",
    operation: "list_schedules" as const,
  }),
  Object.freeze({
    method: "POST" as const,
    path: "/pm/schedules",
    operation: "create_instance" as const,
  }),
  Object.freeze({
    method: "POST" as const,
    path: "/pm/{pm_schedule_id}/complete",
    operation: "complete" as const,
  }),
]);
