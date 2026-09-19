export const FLEET_MANAGER_API_BASE = "/v1/fleet";

export const FLEET_MANAGER_API_HEADERS = Object.freeze({
  authorization: "Authorization",
  tenant: "X-Tenant-Id",
  content_type: "Content-Type",
});

export type FleetManagerApiMethod = "GET";

export type FleetManagerApiOperation =
  | "fleet_health"
  | "fleet_breakdowns"
  | "fleet_pm_status"
  | "fleet_inventory_impact"
  | "fleet_technician_workload"
  | "fleet_find_vehicle"
  | "fleet_aimi_insights";

export type FleetManagerApiRoute = {
  readonly method: FleetManagerApiMethod;
  readonly path: string;
  readonly operation: FleetManagerApiOperation;
};

export const FLEET_MANAGER_API_ROUTES: readonly FleetManagerApiRoute[] = Object.freeze([
  Object.freeze({ method: "GET" as const, path: "/fleet/health", operation: "fleet_health" as const }),
  Object.freeze({ method: "GET" as const, path: "/fleet/breakdowns", operation: "fleet_breakdowns" as const }),
  Object.freeze({ method: "GET" as const, path: "/fleet/pm-status", operation: "fleet_pm_status" as const }),
  Object.freeze({ method: "GET" as const, path: "/fleet/inventory-impact", operation: "fleet_inventory_impact" as const }),
  Object.freeze({ method: "GET" as const, path: "/fleet/technician-workload", operation: "fleet_technician_workload" as const }),
  Object.freeze({ method: "GET" as const, path: "/fleet/find-vehicle", operation: "fleet_find_vehicle" as const }),
  Object.freeze({ method: "GET" as const, path: "/fleet/aimi-insights", operation: "fleet_aimi_insights" as const }),
]);

export function fleetManagerApiPath(path: string, params: Readonly<Record<string, string>>): string {
  let resolved = path;
  const keys = Object.keys(params);
  let index = 0;
  while (index < keys.length) {
    const key = keys[index];
    resolved = resolved.split("{" + key + "}").join(encodeURIComponent(params[key]));
    index = index + 1;
  }
  return "/v1" + resolved;
}
