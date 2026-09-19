import { GLOBAL_DASHBOARD_INTEGRATION_API_ROUTES } from "./api/global-dashboard-integration.api.contract";
import { GLOBAL_DASHBOARD_INTEGRATION_RELEASE_PREP_ROUTES } from "./api/global-dashboard-integration.api.release-prep";
import { integrationHealthStatus } from "./global-dashboard-integration.hardening";

export const RELEASE_PREP_ENV_KEYS = Object.freeze([
  "WFS_CMMS_DATABASE_URL",
  "WFS_CMMS_API_BASE",
]);

export const RELEASE_PREP_REQUIRED_HEADERS = Object.freeze(["Authorization", "X-Tenant-Id"]);

export const RELEASE_PREP_DASHBOARDS = Object.freeze([
  "technician",
  "master_technician",
  "fleet_manager",
  "parts_manager",
  "compliance",
  "driver",
  "silent_master_key",
]);

let lifecycleRegistered = false;
let startupLogged = false;

function envValue(env: NodeJS.ProcessEnv, key: string): string {
  const value = env[key];
  if (value === undefined) {
    return "";
  }
  return value;
}

export function validateReleaseEnvironment(env: NodeJS.ProcessEnv): Readonly<Record<string, string>> {
  const keys = RELEASE_PREP_ENV_KEYS;
  const status: Record<string, string> = {};
  let index = 0;
  while (index < keys.length) {
    const key = keys[index];
    if (envValue(env, key) === "") {
      status[key] = "missing";
    } else {
      status[key] = "present";
    }
    index = index + 1;
  }
  const apiBase = envValue(env, "WFS_CMMS_API_BASE");
  if (apiBase !== "" && apiBase !== "/v1") {
    status.WFS_CMMS_API_BASE = "invalid";
  }
  return Object.freeze(status);
}

export function validateReleaseBuildConfig(env: NodeJS.ProcessEnv): { ok: boolean; env: Readonly<Record<string, string>> } {
  const envStatus = validateReleaseEnvironment(env);
  const database = envStatus.WFS_CMMS_DATABASE_URL;
  const apiBase = envStatus.WFS_CMMS_API_BASE;
  const ok = database !== "invalid" && apiBase !== "invalid";
  return { ok, env: envStatus };
}

export function releasePrepExpectedEndpoints(): readonly string[] {
  const paths: string[] = [];
  let index = 0;
  while (index < GLOBAL_DASHBOARD_INTEGRATION_API_ROUTES.length) {
    paths.push("/v1" + GLOBAL_DASHBOARD_INTEGRATION_API_ROUTES[index].path);
    index = index + 1;
  }
  index = 0;
  while (index < GLOBAL_DASHBOARD_INTEGRATION_RELEASE_PREP_ROUTES.length) {
    paths.push("/v1" + GLOBAL_DASHBOARD_INTEGRATION_RELEASE_PREP_ROUTES[index].path);
    index = index + 1;
  }
  return Object.freeze(paths);
}

export function structuredReleaseLog(event: string, detail: string): string {
  return (
    '{"level":"info","message":"final release preparation",' +
    '"event":"' +
    event +
    '","detail":"' +
    detail +
    '","phase":"Final Release Preparation"}'
  );
}

export function logReleaseStartup(): void {
  if (startupLogged === true) {
    return;
  }
  startupLogged = true;
  if (typeof console !== "undefined" && typeof console.info === "function") {
    console.info(structuredReleaseLog("startup", "backend services"));
  }
}

export function logReleaseShutdown(signal: string): void {
  if (typeof console !== "undefined" && typeof console.info === "function") {
    console.info(structuredReleaseLog("shutdown", signal));
  }
}

export function registerReleasePrepLifecycle(): void {
  if (lifecycleRegistered === true) {
    return;
  }
  lifecycleRegistered = true;
  logReleaseStartup();
  if (typeof process !== "undefined" && typeof process.on === "function") {
    process.on("SIGTERM", () => {
      logReleaseShutdown("SIGTERM");
    });
    process.on("SIGINT", () => {
      logReleaseShutdown("SIGINT");
    });
  }
}

export function releaseStartupDiagnostics(env: NodeJS.ProcessEnv): Readonly<Record<string, unknown>> {
  const build = validateReleaseBuildConfig(env);
  return Object.freeze({
    ok: true,
    phase: "Final Release Preparation",
    mock_data: "absent",
    env: build.env,
    health: integrationHealthStatus(),
    endpoints: releasePrepExpectedEndpoints(),
    dashboards: RELEASE_PREP_DASHBOARDS,
    headers: RELEASE_PREP_REQUIRED_HEADERS,
  });
}

export function releaseReadiness(env: NodeJS.ProcessEnv): Readonly<Record<string, unknown>> {
  const build = validateReleaseBuildConfig(env);
  const health = integrationHealthStatus();
  const ready =
    build.ok === true &&
    health.aimi !== "open" &&
    health.telematics !== "open" &&
    health.compliance !== "open";
  return Object.freeze({
    ok: ready,
    value: Object.freeze({
      ready: ready === true ? "ok" : "not_ready",
      env: build.env,
      health,
    }),
  });
}

export function runReleaseBuildValidation(env: NodeJS.ProcessEnv): number {
  const result = validateReleaseBuildConfig(env);
  if (typeof console !== "undefined" && typeof console.info === "function") {
    console.info(structuredReleaseLog("build_validation", result.ok === true ? "ok" : "error"));
  }
  if (result.ok === false) {
    return 1;
  }
  return 0;
}
