export const INTEGRATION_RETRY_ATTEMPTS = 3;
export const INTEGRATION_CACHE_TTL_MS = 15000;
export const INTEGRATION_REFRESH_MS = 30000;
export const INTEGRATION_CIRCUIT_FAILURES = 5;
export const INTEGRATION_CIRCUIT_OPEN_MS = 30000;

type CacheEntry = { stored_at: number; value: unknown };
type CircuitState = { failures: number; open_until: number };

const cacheEntries: Record<string, CacheEntry> = {};
const circuits: Record<string, CircuitState> = {};

export function sanitizeIntegrationText(value: string): string {
  return value.split("<").join("").split(">").join("").slice(0, 256);
}

export function normalizeIntegrationFilter(query: Readonly<Record<string, string>>): Readonly<Record<string, string>> {
  return Object.freeze({
    asset_id: sanitizeIntegrationText(query.asset_id || query.asset || ""),
    workorder_id: sanitizeIntegrationText(query.workorder_id || ""),
    severity: sanitizeIntegrationText(query.severity || ""),
    status: sanitizeIntegrationText(query.status || ""),
    vendor_id: sanitizeIntegrationText(query.vendor_id || query.vendor || ""),
    page: query.page || "1",
    limit: query.limit || "50",
  });
}

export function cacheKey(path: string, query: Readonly<Record<string, string>>): string {
  return path + ":" + JSON.stringify(query);
}

export function cacheGet(key: string): unknown {
  const entry = cacheEntries[key];
  if (entry === undefined) {
    return null;
  }
  if (Date.now() - entry.stored_at > INTEGRATION_CACHE_TTL_MS) {
    return null;
  }
  return entry.value;
}

export function cacheSet(key: string, value: unknown): void {
  cacheEntries[key] = { stored_at: Date.now(), value };
}

function circuitName(path: string): string {
  if (path.indexOf("aimi") >= 0) {
    return "aimi";
  }
  if (path.indexOf("telematics") >= 0) {
    return "telematics";
  }
  if (path.indexOf("compliance") >= 0) {
    return "compliance";
  }
  return "";
}

export function circuitAllows(path: string): boolean {
  const name = circuitName(path);
  if (name === "") {
    return true;
  }
  const state = circuits[name];
  if (state === undefined) {
    return true;
  }
  if (state.open_until === 0) {
    return true;
  }
  if (Date.now() < state.open_until) {
    return false;
  }
  state.open_until = 0;
  state.failures = 0;
  return true;
}

export function circuitSuccess(path: string): void {
  const name = circuitName(path);
  if (name === "") {
    return;
  }
  circuits[name] = { failures: 0, open_until: 0 };
}

export function circuitFailure(path: string): void {
  const name = circuitName(path);
  if (name === "") {
    return;
  }
  const current = circuits[name] || { failures: 0, open_until: 0 };
  const failures = current.failures + 1;
  circuits[name] = {
    failures,
    open_until: failures >= INTEGRATION_CIRCUIT_FAILURES ? Date.now() + INTEGRATION_CIRCUIT_OPEN_MS : 0,
  };
}

export async function withRetry<T>(run: () => Promise<T>): Promise<T> {
  let attempt = 0;
  let last: T | null = null;
  while (attempt < INTEGRATION_RETRY_ATTEMPTS) {
    try {
      last = await run();
      if (last !== null) {
        return last;
      }
    } catch {
      last = null;
    }
    attempt = attempt + 1;
  }
  if (last === null) {
    throw new Error("integration request failed");
  }
  return last;
}

export function reportIntegrationError(dashboard: string, message: string): void {
  if (typeof window === "undefined") {
    return;
  }
  const current = window.sessionStorage.getItem("wfs.cmms.integration.errors");
  const next = (current === null ? "" : current + "\n") + dashboard + ":" + message;
  window.sessionStorage.setItem("wfs.cmms.integration.errors", next);
}

export function reportIntegrationTelemetry(dashboard: string, event: string): void {
  if (typeof window === "undefined") {
    return;
  }
  const current = window.sessionStorage.getItem("wfs.cmms.integration.telemetry");
  const next = (current === null ? "" : current + "\n") + dashboard + ":" + event + ":" + String(Date.now());
  window.sessionStorage.setItem("wfs.cmms.integration.telemetry", next);
}

export function isMaintenanceMode(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.sessionStorage.getItem("wfs.cmms.maintenance") === "1";
}
