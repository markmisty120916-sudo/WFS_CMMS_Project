import { createGlobalDashboardIntegrationRouter } from "./global-dashboard-integration.routes";
import { GlobalDashboardIntegrationService, type GlobalDashboardIntegrationServiceOptions } from "./global-dashboard-integration.service";
import { mountGlobalDashboardIntegrationExpress } from "./global-dashboard-integration.express";

export function createGlobalDashboardIntegrationModule(options: GlobalDashboardIntegrationServiceOptions) {
  const service = new GlobalDashboardIntegrationService(options);
  return Object.freeze({
    service,
    router: createGlobalDashboardIntegrationRouter(service),
    mountExpress: mountGlobalDashboardIntegrationExpress,
  });
}
