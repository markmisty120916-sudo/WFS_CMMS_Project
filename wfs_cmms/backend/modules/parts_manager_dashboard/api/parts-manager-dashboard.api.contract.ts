export const PARTS_MANAGER_API_BASE = "/v1/parts";

export const PARTS_MANAGER_API_HEADERS = Object.freeze({
  authorization: "Authorization",
  tenant: "X-Tenant-Id",
  content_type: "Content-Type",
});

export type PartsManagerApiMethod = "GET";

export type PartsManagerApiOperation =
  | "inventory_overview"
  | "awaiting_parts"
  | "list_vendors"
  | "usage_history"
  | "predictive_usage"
  | "inventory_alerts";

export type PartsManagerApiRoute = {
  readonly method: PartsManagerApiMethod;
  readonly path: string;
  readonly operation: PartsManagerApiOperation;
};

export const PARTS_MANAGER_API_ROUTES: readonly PartsManagerApiRoute[] = Object.freeze([
  Object.freeze({ method: "GET" as const, path: "/parts/inventory-overview", operation: "inventory_overview" as const }),
  Object.freeze({ method: "GET" as const, path: "/parts/awaiting-parts", operation: "awaiting_parts" as const }),
  Object.freeze({ method: "GET" as const, path: "/parts/vendors", operation: "list_vendors" as const }),
  Object.freeze({ method: "GET" as const, path: "/parts/usage-history", operation: "usage_history" as const }),
  Object.freeze({ method: "GET" as const, path: "/parts/predictive-usage", operation: "predictive_usage" as const }),
  Object.freeze({ method: "GET" as const, path: "/parts/alerts", operation: "inventory_alerts" as const }),
]);
