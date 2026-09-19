export { GlobalDashboardIntegrationService } from "./global-dashboard-integration.service";
export type { GlobalDashboardIntegrationServiceOptions } from "./global-dashboard-integration.service";
export { createGlobalDashboardIntegrationModule } from "./global-dashboard-integration.module";
export { createGlobalDashboardIntegrationRouter } from "./global-dashboard-integration.routes";
export { mountGlobalDashboardIntegrationExpress } from "./global-dashboard-integration.express";
export {
  GLOBAL_DASHBOARD_INTEGRATION_API_BASE,
  GLOBAL_DASHBOARD_INTEGRATION_API_HEADERS,
  GLOBAL_DASHBOARD_INTEGRATION_API_ROUTES,
  globalDashboardIntegrationApiPath,
} from "./api/global-dashboard-integration.api.contract";
export { isGlobalDashboardIntegrationApiAllowed } from "./api/global-dashboard-integration.api.permissions";
export {
  canAccessGlobalDashboardIntegration,
  bypassesTenantIsolation,
  normalizeAssetState,
  normalizeWorkorderState,
  severityColor,
  formatPmInterval,
} from "./global-dashboard-integration-rules";
export { GLOBAL_DASHBOARD_INTEGRATION_EVENT_TYPES } from "./global-dashboard-integration-events";
export { FIND_VEHICLE_LABEL } from "./adapters/telematics.adapter";
