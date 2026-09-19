export const PARTS_REQUEST_API_BASE = "/v1/parts/requests";

export const PARTS_REQUEST_API_HEADERS = Object.freeze({
  authorization: "Authorization",
  tenant: "X-Tenant-Id",
  content_type: "Content-Type",
});

export type PartsRequestApiMethod = "GET" | "POST" | "PUT" | "DELETE";

export type PartsRequestApiOperation =
  | "list_requests"
  | "get_request"
  | "create_request"
  | "update_request"
  | "delete_request"
  | "approve_request"
  | "deny_request";

export type PartsRequestApiRoute = {
  readonly method: PartsRequestApiMethod;
  readonly path: string;
  readonly operation: PartsRequestApiOperation;
};

export const PARTS_REQUEST_API_ROUTES: readonly PartsRequestApiRoute[] = Object.freeze([
  Object.freeze({
    method: "GET" as const,
    path: "/workorders/{workorder_id}/parts/requests",
    operation: "list_requests" as const,
  }),
  Object.freeze({
    method: "POST" as const,
    path: "/workorders/{workorder_id}/parts/requests",
    operation: "create_request" as const,
  }),
  Object.freeze({
    method: "GET" as const,
    path: "/parts/requests/{request_id}",
    operation: "get_request" as const,
  }),
  Object.freeze({
    method: "PUT" as const,
    path: "/parts/requests/{request_id}",
    operation: "update_request" as const,
  }),
  Object.freeze({
    method: "DELETE" as const,
    path: "/parts/requests/{request_id}",
    operation: "delete_request" as const,
  }),
  Object.freeze({
    method: "POST" as const,
    path: "/parts/requests/{request_id}/approve",
    operation: "approve_request" as const,
  }),
  Object.freeze({
    method: "POST" as const,
    path: "/parts/requests/{request_id}/deny",
    operation: "deny_request" as const,
  }),
]);
