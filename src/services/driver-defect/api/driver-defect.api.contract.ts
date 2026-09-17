export const DRIVER_DEFECT_API_BASE = "/v1/driver/defects";

export const DRIVER_DEFECT_API_HEADERS = Object.freeze({
  authorization: "Authorization",
  tenant: "X-Tenant-Id",
  content_type: "Content-Type",
});

export type DriverDefectApiMethod = "GET" | "POST" | "PUT" | "DELETE";

export type DriverDefectApiOperation =
  | "list_defects"
  | "get_defect"
  | "create_defect"
  | "update_defect"
  | "delete_defect";

export type DriverDefectApiRoute = {
  readonly method: DriverDefectApiMethod;
  readonly path: string;
  readonly operation: DriverDefectApiOperation;
};

export const DRIVER_DEFECT_API_ROUTES: readonly DriverDefectApiRoute[] = Object.freeze([
  Object.freeze({
    method: "GET" as const,
    path: "/driver/defects",
    operation: "list_defects" as const,
  }),
  Object.freeze({
    method: "POST" as const,
    path: "/driver/defects",
    operation: "create_defect" as const,
  }),
  Object.freeze({
    method: "GET" as const,
    path: "/driver/defects/{defect_id}",
    operation: "get_defect" as const,
  }),
  Object.freeze({
    method: "PUT" as const,
    path: "/driver/defects/{defect_id}",
    operation: "update_defect" as const,
  }),
  Object.freeze({
    method: "DELETE" as const,
    path: "/driver/defects/{defect_id}",
    operation: "delete_defect" as const,
  }),
]);
