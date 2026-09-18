import type { FleetManagerSession } from "../fleet-manager-dashboard.interface";

export const FLEET_MANAGER_API_BASE = "/v1";

export const FLEET_MANAGER_API_HEADERS = Object.freeze({
  authorization: "Authorization",
  tenant: "X-Tenant-Id",
  content_type: "Content-Type",
});

export const FLEET_MANAGER_CLIENT_ROUTES = Object.freeze({
  health: "/fleet/health",
  breakdowns: "/fleet/breakdowns",
  pm_status: "/fleet/pm-status",
  inventory_impact: "/fleet/inventory-impact",
  technician_workload: "/fleet/technician-workload",
  find_vehicle: "/fleet/find-vehicle",
  aimi_insights: "/fleet/aimi-insights",
  assets: "/assets",
  workorders: "/workorders",
  pm_schedules: "/pm/schedules",
  inventory: "/parts",
  telematics: "/assets",
  insights: "/aimi/insights",
});

export async function fleetManagerRequest(
  session: FleetManagerSession | null,
  path: string,
  query: Readonly<Record<string, string>>,
): Promise<unknown> {
  if (session === null) {
    return null;
  }
  if (session.tenant_id === "") {
    return null;
  }
  const keys = Object.keys(query);
  const pairs: string[] = [];
  let index = 0;
  while (index < keys.length) {
    if (query[keys[index]] !== "") {
      pairs.push(encodeURIComponent(keys[index]) + "=" + encodeURIComponent(query[keys[index]]));
    }
    index = index + 1;
  }
  let url = FLEET_MANAGER_API_BASE + path;
  if (pairs.length > 0) {
    url = url + "?" + pairs.join("&");
  }
  const headers: Record<string, string> = {};
  headers[FLEET_MANAGER_API_HEADERS.authorization] = "Bearer " + session.token;
  headers[FLEET_MANAGER_API_HEADERS.tenant] = session.tenant_id;
  headers[FLEET_MANAGER_API_HEADERS.content_type] = "application/json";
  const response = await fetch(url, { method: "GET", headers });
  if (response.ok === false) {
    return null;
  }
  return response.json();
}
