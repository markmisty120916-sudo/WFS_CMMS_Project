export const API_BASE_URL = "http://localhost:3001/v1";

export const AUTH_AUTHORIZATION_HEADER = "Authorization";
export const AUTH_TENANT_HEADER = "X-Tenant-Id";

export const GLOBAL_DASHBOARD_PATHS = Object.freeze([
  "/integration/health",
  "/integration/ready",
  "/integration/startup",
  "/integration/assets",
  "/integration/workorders",
  "/integration/pm",
  "/integration/inventory",
  "/integration/compliance",
  "/integration/dvir",
  "/integration/defects",
  "/integration/vendors",
  "/integration/telematics",
  "/integration/aimi",
]);

export const FLEET_MANAGER_PATHS = Object.freeze([
  "/fleet/health",
  "/fleet/breakdowns",
  "/fleet/pm-status",
  "/fleet/inventory-impact",
  "/fleet/technician-workload",
  "/fleet/find-vehicle",
  "/fleet/aimi-insights",
]);

export const DRIVER_PORTAL_PATHS = Object.freeze([
  "/driver/assigned-vehicle",
  "/driver/dvir",
  "/driver/defect",
  "/driver/inspections",
  "/driver/workorders",
  "/driver/aimi-safety",
  "/driver/pm",
  "/driver/compliance",
  "/driver/telematics",
]);

export const PARTS_MANAGER_PATHS = Object.freeze([
  "/parts/inventory-overview",
  "/parts/awaiting-parts",
  "/parts/vendors",
  "/parts/usage-history",
  "/parts/predictive-usage",
  "/parts/alerts",
]);

export const COMPLIANCE_DASHBOARD_PATHS = Object.freeze([
  "/compliance/overview",
  "/compliance/inspections",
  "/compliance/dvir",
  "/compliance/safety-workorders",
  "/compliance/findings",
  "/compliance/dot",
  "/compliance/district",
  "/compliance/multilingual",
  "/compliance/voice",
  "/compliance/aimi-insights",
]);

export const SILENT_MASTER_KEY_PATHS = Object.freeze([
  "/silent-master-key/dashboards",
  "/silent-master-key/aimi",
  "/silent-master-key/predictive",
  "/silent-master-key/diagnostics",
  "/silent-master-key/workorders",
]);
