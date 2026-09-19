import type { DriverPortalSession } from "../driver-portal.interface";

export const DRIVER_PORTAL_API_BASE = "/v1";

export const DRIVER_PORTAL_API_HEADERS = Object.freeze({
  authorization: "Authorization",
  tenant: "X-Tenant-Id",
  content_type: "Content-Type",
});

export const DRIVER_PORTAL_CLIENT_ROUTES = Object.freeze({
  assigned_vehicle: "/driver/assigned-vehicle",
  dvir: "/driver/dvir",
  defect: "/driver/defect",
  inspections: "/driver/inspections",
  workorders: "/driver/workorders",
  aimi_safety: "/driver/aimi-safety",
  pm: "/driver/pm",
  compliance: "/driver/compliance",
  telematics: "/driver/telematics",
  note: "/driver/note",
  photo: "/driver/photo",
  alert_ack: "/driver/alert-ack",
});

export async function driverPortalRequest(
  session: DriverPortalSession | null,
  path: string,
  query: Readonly<Record<string, string>>,
  method: "GET" | "POST",
  body: Readonly<Record<string, string>> | null,
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
  let url = DRIVER_PORTAL_API_BASE + path;
  if (pairs.length > 0) {
    url = url + "?" + pairs.join("&");
  }
  const headers: Record<string, string> = {};
  headers[DRIVER_PORTAL_API_HEADERS.authorization] = "Bearer " + session.token;
  headers[DRIVER_PORTAL_API_HEADERS.tenant] = session.tenant_id;
  headers[DRIVER_PORTAL_API_HEADERS.content_type] = "application/json";
  const init: RequestInit = { method, headers };
  if (method === "POST" && body !== null) {
    init.body = JSON.stringify(body);
  }
  const response = await fetch(url, init);
  if (response.ok === false) {
    return null;
  }
  return response.json();
}
