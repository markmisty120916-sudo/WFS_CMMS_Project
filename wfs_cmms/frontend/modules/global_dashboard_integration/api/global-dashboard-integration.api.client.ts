import type { GlobalDashboardIntegrationSession } from "../global-dashboard-integration.interface";
import {
  cacheGet,
  cacheKey,
  cacheSet,
  circuitAllows,
  circuitFailure,
  circuitSuccess,
  normalizeIntegrationFilter,
  withRetry,
} from "../global-dashboard-integration.hardening";

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
  health: "/integration/health",
});

async function fetchOnce(
  session: GlobalDashboardIntegrationSession,
  url: string,
): Promise<unknown> {
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
  const normalized = normalizeIntegrationFilter(query);
  const keys = Object.keys(normalized);
  const pairs: string[] = [];
  let index = 0;
  while (index < keys.length) {
    if (normalized[keys[index]] !== "") {
      pairs.push(encodeURIComponent(keys[index]) + "=" + encodeURIComponent(normalized[keys[index]]));
    }
    index = index + 1;
  }
  let url = GLOBAL_DASHBOARD_INTEGRATION_API_BASE + path;
  if (pairs.length > 0) {
    url = url + "?" + pairs.join("&");
  }
  const key = cacheKey(path, normalized);
  const cached = cacheGet(key);
  if (cached !== null) {
    return cached;
  }
  if (circuitAllows(path) === false) {
    return cached;
  }
  try {
    const payload = await withRetry(() => fetchOnce(session, url));
    if (payload === null) {
      circuitFailure(path);
      return null;
    }
    circuitSuccess(path);
    cacheSet(key, payload);
    return payload;
  } catch {
    circuitFailure(path);
    return cacheGet(key);
  }
}
