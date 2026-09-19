import type { GlobalDashboardIntegrationSession } from "../global-dashboard-integration.interface";

export const GLOBAL_DASHBOARD_INTEGRATION_API_BASE = "/v1";

export const GLOBAL_DASHBOARD_INTEGRATION_API_HEADERS = Object.freeze({
  authorization: "Authorization",
  tenant: "X-Tenant-Id",
  content_type: "Content-Type",
});

export const GLOBAL_DASHBOARD_INTEGRATION_CLIENT_ROUTES = Object.freeze({
  assets: "/integration/assets",
  workorders: "/integration/workorders",
  pm: "/integration/pm",
  inventory: "/integration/inventory",
  compliance: "/integration/compliance",
  dvir: "/integration/dvir",
  defects: "/integration/defects",
  vendors: "/integration/vendors",
  telematics: "/integration/telematics",
  aimi: "/integration/aimi",
});

export async function globalDashboardIntegrationRequest(
  session: GlobalDashboardIntegrationSession | null,
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
  let url = GLOBAL_DASHBOARD_INTEGRATION_API_BASE + path;
  if (pairs.length > 0) {
    url = url + "?" + pairs.join("&");
  }
  const headers: Record<string, string> = {};
  headers[GLOBAL_DASHBOARD_INTEGRATION_API_HEADERS.authorization] = "Bearer " + session.token;
  headers[GLOBAL_DASHBOARD_INTEGRATION_API_HEADERS.tenant] = session.tenant_id;
  headers[GLOBAL_DASHBOARD_INTEGRATION_API_HEADERS.content_type] = "application/json";
  const response = await fetch(url, { method: "GET", headers });
  if (response.ok === false) {
    return null;
  }
  return response.json();
}
