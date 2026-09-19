import { ASSET_STATES, WORKORDER_STATES } from "./global-dashboard-integration-rules";
import type { GlobalDashboardIntegrationApiOperation } from "./api/global-dashboard-integration.api.contract";
import type { GlobalDashboardIntegrationFilter } from "./global-dashboard-integration.interface";

const RATE_WINDOW_MS = 60000;
const RATE_MAX_AIMI = 30;
const RATE_MAX_TELEMATICS = 30;
const CIRCUIT_FAILURES = 5;
const CIRCUIT_OPEN_MS = 30000;
const CACHE_TTL_MS = 15000;

type RateWindow = { count: number; started_at: number };
type CircuitState = { failures: number; open_until: number };
type CacheEntry = { stored_at: number; value: unknown };

const rateWindows: Record<string, RateWindow> = {};
const circuits: Record<string, CircuitState> = {};
const cacheEntries: Record<string, CacheEntry> = {};
let maintenanceEnabled = false;

export function setIntegrationMaintenanceMode(enabled: boolean): void {
  maintenanceEnabled = enabled;
}

export function isIntegrationMaintenanceMode(): boolean {
  return maintenanceEnabled;
}

export function sanitizeIntegrationText(value: string): string {
  return value.split("<").join("").split(">").join("").slice(0, 256);
}

function isSafeId(value: string): boolean {
  if (value === "") {
    return true;
  }
  if (value.length > 128) {
    return false;
  }
  if (value.indexOf("<") >= 0 || value.indexOf(">") >= 0) {
    return false;
  }
  return true;
}

function isSeverity(value: string): boolean {
  if (value === "") {
    return true;
  }
  if (value === "S1" || value === "S2" || value === "S3" || value === "S4" || value === "S5") {
    return true;
  }
  return false;
}

function isKnownStatus(value: string): boolean {
  if (value === "") {
    return true;
  }
  const workorders = WORKORDER_STATES();
  let index = 0;
  while (index < workorders.length) {
    if (workorders[index] === value) {
      return true;
    }
    index = index + 1;
  }
  const assets = ASSET_STATES();
  index = 0;
  while (index < assets.length) {
    if (assets[index] === value) {
      return true;
    }
    index = index + 1;
  }
  return false;
}

function isPageToken(value: string): boolean {
  if (value === "") {
    return true;
  }
  const parsed = Number(value);
  if (Number.isFinite(parsed) === false) {
    return false;
  }
  if (parsed < 1) {
    return false;
  }
  return true;
}

export function validateIntegrationQuery(query: Readonly<Record<string, string>>): boolean {
  if (isSafeId(query.asset_id || query.asset || "") === false) {
    return false;
  }
  if (isSafeId(query.workorder_id || "") === false) {
    return false;
  }
  if (isSafeId(query.vendor_id || query.vendor || "") === false) {
    return false;
  }
  if (isSeverity(query.severity || "") === false) {
    return false;
  }
  if (isKnownStatus(query.status || "") === false) {
    return false;
  }
  if (isPageToken(query.page || "") === false) {
    return false;
  }
  if (isPageToken(query.limit || "") === false) {
    return false;
  }
  return true;
}

export function integrationFilterFromQuery(query: Readonly<Record<string, string>>): GlobalDashboardIntegrationFilter {
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

export function paginateIntegrationList<T>(items: readonly T[], pageToken: string, limitToken: string): readonly T[] {
  const page = Number(pageToken === "" ? "1" : pageToken);
  const limitRaw = Number(limitToken === "" ? "50" : limitToken);
  const limit = limitRaw > 100 ? 100 : limitRaw;
  const start = (page - 1) * limit;
  if (start < 0) {
    return items;
  }
  return items.slice(start, start + limit);
}

export function sanitizeIntegrationValue(value: unknown): unknown {
  if (typeof value === "string") {
    return sanitizeIntegrationText(value);
  }
  if (Array.isArray(value) === true) {
    const items: unknown[] = [];
    let index = 0;
    while (index < value.length) {
      items.push(sanitizeIntegrationValue(value[index]));
      index = index + 1;
    }
    return items;
  }
  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record);
    const next: Record<string, unknown> = {};
    let index = 0;
    while (index < keys.length) {
      next[keys[index]] = sanitizeIntegrationValue(record[keys[index]]);
      index = index + 1;
    }
    return next;
  }
  return value;
}

export function rateLimitAllows(tenant_id: string, operation: GlobalDashboardIntegrationApiOperation): boolean {
  if (operation !== "aimi" && operation !== "telematics") {
    return true;
  }
  const max = operation === "aimi" ? RATE_MAX_AIMI : RATE_MAX_TELEMATICS;
  const key = tenant_id + ":" + operation;
  const now = Date.now();
  const window = rateWindows[key];
  if (window === undefined || now - window.started_at > RATE_WINDOW_MS) {
    rateWindows[key] = { count: 1, started_at: now };
    return true;
  }
  if (window.count >= max) {
    return false;
  }
  window.count = window.count + 1;
  return true;
}

export function circuitAllows(operation: GlobalDashboardIntegrationApiOperation): boolean {
  if (operation !== "aimi" && operation !== "telematics" && operation !== "compliance") {
    return true;
  }
  const state = circuits[operation];
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

export function circuitSuccess(operation: GlobalDashboardIntegrationApiOperation): void {
  circuits[operation] = { failures: 0, open_until: 0 };
}

export function circuitFailure(operation: GlobalDashboardIntegrationApiOperation): void {
  const current = circuits[operation] || { failures: 0, open_until: 0 };
  const failures = current.failures + 1;
  const open_until = failures >= CIRCUIT_FAILURES ? Date.now() + CIRCUIT_OPEN_MS : 0;
  circuits[operation] = { failures, open_until };
}

export function cacheGet(key: string): unknown {
  const entry = cacheEntries[key];
  if (entry === undefined) {
    return null;
  }
  if (Date.now() - entry.stored_at > CACHE_TTL_MS) {
    return null;
  }
  return entry.value;
}

export function cacheSet(key: string, value: unknown): void {
  cacheEntries[key] = { stored_at: Date.now(), value };
}

export function cacheKey(tenant_id: string, operation: string, filter: GlobalDashboardIntegrationFilter): string {
  return (
    tenant_id +
    ":" +
    operation +
    ":" +
    filter.asset_id +
    ":" +
    filter.workorder_id +
    ":" +
    filter.severity +
    ":" +
    filter.status +
    ":" +
    filter.vendor_id +
    ":" +
    filter.page +
    ":" +
    filter.limit
  );
}

export function integrationHealthStatus(): Readonly<Record<string, string>> {
  return Object.freeze({
    assets: "ok",
    aimi: circuitAllows("aimi") === true ? "ok" : "open",
    telematics: circuitAllows("telematics") === true ? "ok" : "open",
    compliance: circuitAllows("compliance") === true ? "ok" : "open",
    maintenance: isIntegrationMaintenanceMode() === true ? "on" : "off",
  });
}

export function structuredIntegrationLog(
  operation: string,
  tenant_id: string,
  user_id: string,
  role: string,
  outcome: string,
): string {
  return (
    '{"level":"info","message":"global dashboard integration",' +
    '"operation":"' +
    operation +
    '","tenant_id":"' +
    tenant_id +
    '","user_id":"' +
    user_id +
    '","role":"' +
    role +
    '","outcome":"' +
    outcome +
    '"}'
  );
}
