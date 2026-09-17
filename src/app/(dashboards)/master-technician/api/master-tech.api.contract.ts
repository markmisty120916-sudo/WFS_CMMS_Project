import type { MasterTechSession } from "../master-tech.interface";
import { isMasterTechApiAllowed } from "./master-tech.api.permissions";

export const MASTER_TECH_API_BASE = "/v1";

export const MASTER_TECH_API_HEADERS = Object.freeze({
  authorization: "Authorization",
  tenant: "X-Tenant-Id",
  content_type: "Content-Type",
});

export type MasterTechApiMethod = "GET" | "POST";

export type MasterTechApiOperation =
  | "list_workorders"
  | "get_workorder"
  | "get_severity"
  | "launch_diagnostics"
  | "list_insights"
  | "list_assets"
  | "list_pm_schedules"
  | "list_parts"
  | "list_inspections"
  | "list_events"
  | "voice_command"
  | "translate"
  | "detect_language";

export type MasterTechApiRoute = {
  readonly method: MasterTechApiMethod;
  readonly path: string;
  readonly operation: MasterTechApiOperation;
};

export const MASTER_TECH_API_ROUTES: readonly MasterTechApiRoute[] = Object.freeze([
  Object.freeze({
    method: "GET" as const,
    path: "/workorders",
    operation: "list_workorders" as const,
  }),
  Object.freeze({
    method: "GET" as const,
    path: "/workorders/{workorder_id}",
    operation: "get_workorder" as const,
  }),
  Object.freeze({
    method: "GET" as const,
    path: "/aimi/severity/{workorder_id}",
    operation: "get_severity" as const,
  }),
  Object.freeze({
    method: "POST" as const,
    path: "/aimi/diagnostics/launch",
    operation: "launch_diagnostics" as const,
  }),
  Object.freeze({
    method: "GET" as const,
    path: "/aimi/insights",
    operation: "list_insights" as const,
  }),
  Object.freeze({
    method: "GET" as const,
    path: "/assets",
    operation: "list_assets" as const,
  }),
  Object.freeze({
    method: "GET" as const,
    path: "/pm/schedules",
    operation: "list_pm_schedules" as const,
  }),
  Object.freeze({
    method: "GET" as const,
    path: "/parts",
    operation: "list_parts" as const,
  }),
  Object.freeze({
    method: "GET" as const,
    path: "/compliance/inspections",
    operation: "list_inspections" as const,
  }),
  Object.freeze({
    method: "GET" as const,
    path: "/events",
    operation: "list_events" as const,
  }),
  Object.freeze({
    method: "POST" as const,
    path: "/voice/commands",
    operation: "voice_command" as const,
  }),
  Object.freeze({
    method: "POST" as const,
    path: "/multilingual/translate",
    operation: "translate" as const,
  }),
  Object.freeze({
    method: "POST" as const,
    path: "/multilingual/detect",
    operation: "detect_language" as const,
  }),
]);

export function masterTechApiPath(path: string, params: Readonly<Record<string, string>>): string {
  let resolved = path;
  const keys = Object.keys(params);
  let index = 0;
  while (index < keys.length) {
    const key = keys[index];
    resolved = resolved.split("{" + key + "}").join(encodeURIComponent(params[key]));
    index = index + 1;
  }
  return MASTER_TECH_API_BASE + resolved;
}

export async function masterTechApiRequest(
  session: MasterTechSession | null,
  operation: MasterTechApiOperation,
  path: string,
  method: MasterTechApiMethod,
  query: Readonly<Record<string, string>>,
  body: unknown,
): Promise<unknown> {
  if (session === null) {
    return null;
  }
  if (isMasterTechApiAllowed(operation, session.role) === false) {
    return null;
  }
  if (session.tenant_id === "") {
    return null;
  }

  const queryKeys = Object.keys(query);
  const pairs: string[] = [];
  let queryIndex = 0;
  while (queryIndex < queryKeys.length) {
    const key = queryKeys[queryIndex];
    if (query[key] !== "") {
      pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(query[key]));
    }
    queryIndex = queryIndex + 1;
  }

  let url = path;
  if (pairs.length > 0) {
    url = path + "?" + pairs.join("&");
  }

  const headers: Record<string, string> = {};
  headers[MASTER_TECH_API_HEADERS.authorization] = "Bearer " + session.token;
  headers[MASTER_TECH_API_HEADERS.tenant] = session.tenant_id;
  headers[MASTER_TECH_API_HEADERS.content_type] = "application/json";

  const init: RequestInit = {
    method,
    headers,
  };
  if (method === "POST") {
    init.body = JSON.stringify(body);
  }

  const response = await fetch(url, init);
  if (response.ok === false) {
    return null;
  }
  const payload: unknown = await response.json();
  return payload;
}
