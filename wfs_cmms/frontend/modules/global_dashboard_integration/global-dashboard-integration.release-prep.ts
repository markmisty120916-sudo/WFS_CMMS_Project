import { GLOBAL_DASHBOARD_INTEGRATION_CLIENT_ROUTES } from "./api/global-dashboard-integration.api.client";
import { loadGlobalDashboardIntegrationSession } from "./hooks/useGlobalDashboardIntegrationApi";

export const RELEASE_PREP_CLIENT_ROUTES = Object.freeze({
  ready: "/integration/ready",
  startup: "/integration/startup",
});

export const RELEASE_PREP_DASHBOARDS = Object.freeze([
  "technician",
  "master_technician",
  "fleet_manager",
  "parts_manager",
  "compliance",
  "driver",
  "silent_master_key",
]);

export function releasePrepLabel(key: string): string {
  if (key === "preflight") {
    return "Release preflight";
  }
  if (key === "preflight_failed") {
    return "Release preflight failed";
  }
  if (key === "env_invalid") {
    return "Environment invalid";
  }
  if (key === "ready") {
    return "Release ready";
  }
  return key;
}

export function structuredReleaseClientLog(event: string, detail: string): string {
  return (
    '{"level":"info","message":"final release preparation",' +
    '"event":"' +
    event +
    '","detail":"' +
    detail +
    '","phase":"Final Release Preparation"}'
  );
}

export function reportReleaseStartup(event: string, detail: string): void {
  if (typeof window === "undefined") {
    return;
  }
  const line = structuredReleaseClientLog(event, detail);
  const current = window.sessionStorage.getItem("wfs.cmms.release.startup");
  const next = (current === null ? "" : current + "\n") + line;
  window.sessionStorage.setItem("wfs.cmms.release.startup", next);
  if (typeof console !== "undefined" && typeof console.info === "function") {
    console.info(line);
  }
}

export function validateFrontendReleaseEnvironment(): { ok: boolean; reason: string } {
  if (typeof window !== "undefined") {
    const mock = window.sessionStorage.getItem("wfs.cmms.mock");
    if (mock === "1") {
      return { ok: false, reason: "mock" };
    }
  }
  if (typeof process !== "undefined" && process.env !== undefined) {
    const apiBase = process.env.NEXT_PUBLIC_WFS_CMMS_API_BASE;
    if (apiBase !== undefined && apiBase !== "" && apiBase !== "/v1") {
      return { ok: false, reason: "api_base" };
    }
  }
  return { ok: true, reason: "" };
}

export function releasePreflightLocal(): { ok: boolean; reason: string } {
  const env = validateFrontendReleaseEnvironment();
  if (env.ok === false) {
    return env;
  }
  const session = loadGlobalDashboardIntegrationSession();
  if (session !== null && session.tenant_id === "") {
    return { ok: false, reason: "tenant_id" };
  }
  return { ok: true, reason: "" };
}

export function releaseArtifactEndpoints(): readonly string[] {
  return Object.freeze([
    GLOBAL_DASHBOARD_INTEGRATION_CLIENT_ROUTES.assets,
    GLOBAL_DASHBOARD_INTEGRATION_CLIENT_ROUTES.workorders,
    GLOBAL_DASHBOARD_INTEGRATION_CLIENT_ROUTES.pm,
    GLOBAL_DASHBOARD_INTEGRATION_CLIENT_ROUTES.inventory,
    GLOBAL_DASHBOARD_INTEGRATION_CLIENT_ROUTES.compliance,
    GLOBAL_DASHBOARD_INTEGRATION_CLIENT_ROUTES.dvir,
    GLOBAL_DASHBOARD_INTEGRATION_CLIENT_ROUTES.defects,
    GLOBAL_DASHBOARD_INTEGRATION_CLIENT_ROUTES.vendors,
    GLOBAL_DASHBOARD_INTEGRATION_CLIENT_ROUTES.telematics,
    GLOBAL_DASHBOARD_INTEGRATION_CLIENT_ROUTES.aimi,
    GLOBAL_DASHBOARD_INTEGRATION_CLIENT_ROUTES.health,
    RELEASE_PREP_CLIENT_ROUTES.ready,
    RELEASE_PREP_CLIENT_ROUTES.startup,
  ]);
}
