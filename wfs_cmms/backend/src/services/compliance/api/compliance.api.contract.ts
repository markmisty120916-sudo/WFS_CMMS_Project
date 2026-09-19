export const COMPLIANCE_API_BASE = "/v1/compliance";

export const COMPLIANCE_API_HEADERS = Object.freeze({
  authorization: "Authorization",
  tenant: "X-Tenant-Id",
  content_type: "Content-Type",
});

export type ComplianceApiMethod = "GET" | "POST" | "PUT" | "DELETE";

export type ComplianceApiOperation =
  | "list_templates"
  | "create_template"
  | "update_template"
  | "delete_template"
  | "list_inspections"
  | "create_inspection"
  | "complete_inspection"
  | "create_driver_report";

export type ComplianceApiRoute = {
  readonly method: ComplianceApiMethod;
  readonly path: string;
  readonly operation: ComplianceApiOperation;
};

export const COMPLIANCE_API_ROUTES: readonly ComplianceApiRoute[] = Object.freeze([
  Object.freeze({
    method: "GET" as const,
    path: "/compliance/inspections",
    operation: "list_inspections" as const,
  }),
  Object.freeze({
    method: "POST" as const,
    path: "/compliance/inspections",
    operation: "create_inspection" as const,
  }),
  Object.freeze({
    method: "POST" as const,
    path: "/compliance/inspections/{inspection_id}/complete",
    operation: "complete_inspection" as const,
  }),
  Object.freeze({
    method: "POST" as const,
    path: "/compliance/driver-reports",
    operation: "create_driver_report" as const,
  }),
]);
