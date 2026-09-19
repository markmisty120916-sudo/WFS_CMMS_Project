import type { SilentMasterKeySession } from "../silent-master-key-dashboard.interface";

export const SILENT_MASTER_KEY_API_BASE = "/v1";

export const SILENT_MASTER_KEY_API_HEADERS = Object.freeze({
  authorization: "Authorization",
  tenant: "X-Tenant-Id",
  content_type: "Content-Type",
});

export const SILENT_MASTER_KEY_CLIENT_ROUTES = Object.freeze({
  dashboards: "/silent-master-key/dashboards",
  aimi: "/silent-master-key/aimi",
  predictive: "/silent-master-key/predictive",
  diagnostics: "/silent-master-key/diagnostics",
  workorders: "/silent-master-key/workorders",
  severity_override: "/silent-master-key/severity-override",
  routing_override: "/silent-master-key/routing-override",
  scheduling_override: "/silent-master-key/scheduling-override",
});

export async function silentMasterKeyRequest(
  session: SilentMasterKeySession | null,
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
  let url = SILENT_MASTER_KEY_API_BASE + path;
  if (pairs.length > 0) {
    url = url + "?" + pairs.join("&");
  }
  const headers: Record<string, string> = {};
  headers[SILENT_MASTER_KEY_API_HEADERS.authorization] = "Bearer " + session.token;
  headers[SILENT_MASTER_KEY_API_HEADERS.tenant] = session.tenant_id;
  headers[SILENT_MASTER_KEY_API_HEADERS.content_type] = "application/json";
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
