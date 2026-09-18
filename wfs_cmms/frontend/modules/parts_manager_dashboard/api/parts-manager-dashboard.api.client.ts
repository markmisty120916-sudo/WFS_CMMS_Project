import type { PartsManagerSession } from "../parts-manager-dashboard.interface";

export const PARTS_MANAGER_API_BASE = "/v1";

export const PARTS_MANAGER_API_HEADERS = Object.freeze({
  authorization: "Authorization",
  tenant: "X-Tenant-Id",
  content_type: "Content-Type",
});

export const PARTS_MANAGER_CLIENT_ROUTES = Object.freeze({
  inventory_overview: "/parts/inventory-overview",
  awaiting_parts: "/parts/awaiting-parts",
  vendors: "/parts/vendors",
  usage_history: "/parts/usage-history",
  predictive_usage: "/parts/predictive-usage",
  alerts: "/parts/alerts",
  inventory: "/parts",
  parts: "/parts",
  workorders: "/workorders",
  pm_schedules: "/pm/schedules",
  aimi_predictive: "/parts/predictive-usage",
});

export async function partsManagerRequest(
  session: PartsManagerSession | null,
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
  let url = PARTS_MANAGER_API_BASE + path;
  if (pairs.length > 0) {
    url = url + "?" + pairs.join("&");
  }
  const headers: Record<string, string> = {};
  headers[PARTS_MANAGER_API_HEADERS.authorization] = "Bearer " + session.token;
  headers[PARTS_MANAGER_API_HEADERS.tenant] = session.tenant_id;
  headers[PARTS_MANAGER_API_HEADERS.content_type] = "application/json";
  const response = await fetch(url, { method: "GET", headers });
  if (response.ok === false) {
    return null;
  }
  return response.json();
}
