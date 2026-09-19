export const SILENT_MASTER_KEY_API_BASE = "/v1/silent-master-key";

export const SILENT_MASTER_KEY_API_HEADERS = Object.freeze({
  authorization: "Authorization",
  tenant: "X-Tenant-Id",
  content_type: "Content-Type",
});

export type SilentMasterKeyApiMethod = "GET" | "POST";

export type SilentMasterKeyApiOperation =
  | "dashboards"
  | "aimi"
  | "predictive"
  | "diagnostics"
  | "workorders"
  | "severity_override"
  | "routing_override"
  | "scheduling_override";

export type SilentMasterKeyApiRoute = {
  readonly method: SilentMasterKeyApiMethod;
  readonly path: string;
  readonly operation: SilentMasterKeyApiOperation;
};

export const SILENT_MASTER_KEY_API_ROUTES: readonly SilentMasterKeyApiRoute[] = Object.freeze([
  Object.freeze({ method: "GET" as const, path: "/silent-master-key/dashboards", operation: "dashboards" as const }),
  Object.freeze({ method: "GET" as const, path: "/silent-master-key/aimi", operation: "aimi" as const }),
  Object.freeze({ method: "GET" as const, path: "/silent-master-key/predictive", operation: "predictive" as const }),
  Object.freeze({ method: "GET" as const, path: "/silent-master-key/diagnostics", operation: "diagnostics" as const }),
  Object.freeze({ method: "GET" as const, path: "/silent-master-key/workorders", operation: "workorders" as const }),
  Object.freeze({ method: "POST" as const, path: "/silent-master-key/severity-override", operation: "severity_override" as const }),
  Object.freeze({ method: "POST" as const, path: "/silent-master-key/routing-override", operation: "routing_override" as const }),
  Object.freeze({ method: "POST" as const, path: "/silent-master-key/scheduling-override", operation: "scheduling_override" as const }),
]);
