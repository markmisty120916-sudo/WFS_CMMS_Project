import axios from "axios";
import {
  API_BASE_URL,
  AUTH_AUTHORIZATION_HEADER,
  AUTH_TENANT_HEADER,
} from "./paths";

export type RuntimeSession = {
  readonly tenant_id: string;
  readonly token: string;
};

function storageValue(key: string): string {
  if (typeof window === "undefined") {
    return "";
  }
  const value = window.sessionStorage.getItem(key);
  return value === null ? "" : value;
}

export function loadRuntimeSession(): RuntimeSession | null {
  const token = storageValue("wfs.cmms.token");
  if (token === "") {
    return null;
  }
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }
  try {
    const json = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    const parsed: unknown = JSON.parse(json);
    if (parsed === null || typeof parsed !== "object") {
      return null;
    }
    const record = parsed as Record<string, unknown>;
    const tenant_id = typeof record.tenant_id === "string" ? record.tenant_id : "";
    if (tenant_id === "") {
      return null;
    }
    return { tenant_id, token };
  } catch {
    return null;
  }
}

export function saveRuntimeTenant(tenant_id: string): void {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.setItem("wfs.cmms.tenant_id", tenant_id);
}

const client = axios.create({
  baseURL: API_BASE_URL,
});

client.interceptors.request.use((config) => {
  const session = loadRuntimeSession();
  const headers = config.headers;
  if (session !== null) {
    headers.set(AUTH_AUTHORIZATION_HEADER, "Bearer " + session.token);
    headers.set(AUTH_TENANT_HEADER, session.tenant_id);
  }
  return config;
});

export async function getLockedPath(path: string): Promise<unknown> {
  const session = loadRuntimeSession();
  if (session === null) {
    return { ok: false, error: "session required" };
  }
  if (session.tenant_id === "") {
    return { ok: false, error: "tenant_id required" };
  }
  try {
    const response = await client.get(path);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) === true && error.response !== undefined) {
      return error.response.data;
    }
    return { ok: false, error: "request failed" };
  }
}
