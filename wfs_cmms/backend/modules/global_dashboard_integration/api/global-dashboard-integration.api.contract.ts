export const GLOBAL_DASHBOARD_INTEGRATION_API_BASE = "/v1/integration";

export const GLOBAL_DASHBOARD_INTEGRATION_API_HEADERS = Object.freeze({
  authorization: "Authorization",
  tenant: "X-Tenant-Id",
  content_type: "Content-Type",
});

export type GlobalDashboardIntegrationApiMethod = "GET";

export type GlobalDashboardIntegrationApiOperation =
  | "assets"
  | "workorders"
  | "pm"
  | "inventory"
  | "compliance"
  | "dvir"
  | "defects"
  | "vendors"
  | "telematics"
  | "aimi";

export type GlobalDashboardIntegrationApiRoute = {
  readonly method: GlobalDashboardIntegrationApiMethod;
  readonly path: string;
  readonly operation: GlobalDashboardIntegrationApiOperation;
};

export const GLOBAL_DASHBOARD_INTEGRATION_API_ROUTES: readonly GlobalDashboardIntegrationApiRoute[] = Object.freeze([
  Object.freeze({ method: "GET" as const, path: "/integration/assets", operation: "assets" as const }),
  Object.freeze({ method: "GET" as const, path: "/integration/workorders", operation: "workorders" as const }),
  Object.freeze({ method: "GET" as const, path: "/integration/pm", operation: "pm" as const }),
  Object.freeze({ method: "GET" as const, path: "/integration/inventory", operation: "inventory" as const }),
  Object.freeze({ method: "GET" as const, path: "/integration/compliance", operation: "compliance" as const }),
  Object.freeze({ method: "GET" as const, path: "/integration/dvir", operation: "dvir" as const }),
  Object.freeze({ method: "GET" as const, path: "/integration/defects", operation: "defects" as const }),
  Object.freeze({ method: "GET" as const, path: "/integration/vendors", operation: "vendors" as const }),
  Object.freeze({ method: "GET" as const, path: "/integration/telematics", operation: "telematics" as const }),
  Object.freeze({ method: "GET" as const, path: "/integration/aimi", operation: "aimi" as const }),
]);

export function globalDashboardIntegrationApiPath(path: string): string {
  return "/v1" + path;
}
