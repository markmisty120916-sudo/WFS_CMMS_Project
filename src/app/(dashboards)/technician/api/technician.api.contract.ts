import type { TechnicianSession } from "../technician.interface";
import { isTechnicianApiAllowed } from "./technician.api.permissions";

export const TECHNICIAN_API_BASE = "/v1";

export const TECHNICIAN_API_HEADERS = Object.freeze({
  authorization: "Authorization",
  tenant: "X-Tenant-Id",
  content_type: "Content-Type",
});

export type TechnicianApiMethod = "GET" | "POST";

export type TechnicianApiOperation =
  | "list_workorders"
  | "get_workorder"
  | "get_severity"
  | "list_insights"
  | "list_assets"
  | "get_asset"
  | "list_pm_schedules"
  | "list_part_requests"
  | "list_events"
  | "voice_command"
  | "translate"
  | "detect_language";

export type TechnicianApiRoute = {
  readonly method: TechnicianApiMethod;
  readonly path: string;
  readonly operation: TechnicianApiOperation;
};

export const TECHNICIAN_API_ROUTES: readonly TechnicianApiRoute[] = Object.freeze([
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
    path: "/assets/{asset_id}",
    operation: "get_asset" as const,
  }),
  Object.freeze({
    method: "GET" as const,
    path: "/pm/schedules",
    operation: "list_pm_schedules" as const,
  }),
  Object.freeze({
    method: "GET" as const,
    path: "/workorders/{workorder_id}/parts/requests",
    operation: "list_part_requests" as const,
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

export function technicianApiRoute(operation: TechnicianApiOperation): TechnicianApiRoute | null {
  let index = 0;
  while (index < TECHNICIAN_API_ROUTES.length) {
    if (TECHNICIAN_API_ROUTES[index].operation === operation) {
      return TECHNICIAN_API_ROUTES[index];
    }
    index = index + 1;
  }
  return null;
}

export function technicianApiPath(path: string, params: Readonly<Record<string, string>>): string {
  let resolved = path;
  const keys = Object.keys(params);
  let index = 0;
  while (index < keys.length) {
    const key = keys[index];
    resolved = resolved.split("{" + key + "}").join(encodeURIComponent(params[key]));
    index = index + 1;
  }
  return TECHNICIAN_API_BASE + resolved;
}

export async function technicianApiRequest(
  session: TechnicianSession | null,
  operation: TechnicianApiOperation,
  path: string,
  method: TechnicianApiMethod,
  query: Readonly<Record<string, string>>,
  body: unknown,
): Promise<unknown> {
  if (session === null) {
    return null;
  }
  if (isTechnicianApiAllowed(operation, session.role) === false) {
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
  headers[TECHNICIAN_API_HEADERS.authorization] = "Bearer " + session.token;
  headers[TECHNICIAN_API_HEADERS.tenant] = session.tenant_id;
  headers[TECHNICIAN_API_HEADERS.content_type] = "application/json";

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
