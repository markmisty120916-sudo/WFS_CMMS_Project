export const COMPLIANCE_DASHBOARD_API_BASE = "/v1/compliance";

export const COMPLIANCE_DASHBOARD_API_HEADERS = Object.freeze({
  authorization: "Authorization",
  tenant: "X-Tenant-Id",
  content_type: "Content-Type",
});

export type ComplianceDashboardApiMethod = "GET";

export type ComplianceDashboardApiOperation =
  | "overview"
  | "inspections"
  | "dvir"
  | "safety_workorders"
  | "findings"
  | "dot"
  | "district"
  | "multilingual"
  | "voice"
  | "aimi_insights";

export type ComplianceDashboardApiRoute = {
  readonly method: ComplianceDashboardApiMethod;
  readonly path: string;
  readonly operation: ComplianceDashboardApiOperation;
};

export const COMPLIANCE_DASHBOARD_API_ROUTES: readonly ComplianceDashboardApiRoute[] = Object.freeze([
  Object.freeze({ method: "GET" as const, path: "/compliance/overview", operation: "overview" as const }),
  Object.freeze({ method: "GET" as const, path: "/compliance/inspections", operation: "inspections" as const }),
  Object.freeze({ method: "GET" as const, path: "/compliance/dvir", operation: "dvir" as const }),
  Object.freeze({ method: "GET" as const, path: "/compliance/safety-workorders", operation: "safety_workorders" as const }),
  Object.freeze({ method: "GET" as const, path: "/compliance/findings", operation: "findings" as const }),
  Object.freeze({ method: "GET" as const, path: "/compliance/dot", operation: "dot" as const }),
  Object.freeze({ method: "GET" as const, path: "/compliance/district", operation: "district" as const }),
  Object.freeze({ method: "GET" as const, path: "/compliance/multilingual", operation: "multilingual" as const }),
  Object.freeze({ method: "GET" as const, path: "/compliance/voice", operation: "voice" as const }),
  Object.freeze({ method: "GET" as const, path: "/compliance/aimi-insights", operation: "aimi_insights" as const }),
]);
