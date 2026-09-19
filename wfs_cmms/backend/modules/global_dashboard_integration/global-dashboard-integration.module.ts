import { createGlobalDashboardIntegrationRouter } from "./global-dashboard-integration.routes";
import { createGlobalDashboardIntegrationReleasePrepRouter } from "./global-dashboard-integration.release-prep.routes";
import { registerReleasePrepLifecycle } from "./global-dashboard-integration.release-prep";
import { GlobalDashboardIntegrationService, type GlobalDashboardIntegrationServiceOptions } from "./global-dashboard-integration.service";
import { mountGlobalDashboardIntegrationExpress } from "./global-dashboard-integration.express";

export function createGlobalDashboardIntegrationModule(options: GlobalDashboardIntegrationServiceOptions) {
  const service = new GlobalDashboardIntegrationService(options);
  registerReleasePrepLifecycle();
  return Object.freeze({
    service,
    router: createGlobalDashboardIntegrationRouter(service),
    releasePrepRouter: createGlobalDashboardIntegrationReleasePrepRouter(),
    mountExpress: mountGlobalDashboardIntegrationExpress,
  });
}
