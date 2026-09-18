import type { ComplianceDashboardSession } from "../compliance-dashboard.interface";

export const COMPLIANCE_DASHBOARD_API_BASE = "/v1";

export const COMPLIANCE_DASHBOARD_API_HEADERS = Object.freeze({
  authorization: "Authorization",
  tenant: "X-Tenant-Id",
  content_type: "Content-Type",
});

export const COMPLIANCE_DASHBOARD_CLIENT_ROUTES = Object.freeze({
  overview: "/compliance/overview",
  inspections: "/compliance/inspections",
  dvir: "/compliance/dvir",
  safety_workorders: "/compliance/safety-workorders",
  findings: "/compliance/findings",
  dot: "/compliance/dot",
  district: "/compliance/district",
  multilingual: "/compliance/multilingual",
  voice: "/compliance/voice",
  aimi_insights: "/compliance/aimi-insights",
  pm_schedules: "/pm/schedules",
  assets: "/assets",
  workorders: "/workorders",
  driver_defects: "/driver/defects",
});

export async function complianceDashboardRequest(
  session: ComplianceDashboardSession | null,
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
  let url = COMPLIANCE_DASHBOARD_API_BASE + path;
  if (pairs.length > 0) {
    url = url + "?" + pairs.join("&");
  }
  const headers: Record<string, string> = {};
  headers[COMPLIANCE_DASHBOARD_API_HEADERS.authorization] = "Bearer " + session.token;
  headers[COMPLIANCE_DASHBOARD_API_HEADERS.tenant] = session.tenant_id;
  headers[COMPLIANCE_DASHBOARD_API_HEADERS.content_type] = "application/json";
  const response = await fetch(url, { method: "GET", headers });
  if (response.ok === false) {
    return null;
  }
  return response.json();
}
