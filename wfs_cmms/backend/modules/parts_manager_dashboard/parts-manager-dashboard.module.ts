import { createPartsManagerDashboardRouter } from "./parts-manager-dashboard.routes";
import { PartsManagerDashboardService, type PartsManagerDashboardServiceOptions } from "./parts-manager-dashboard.service";
import { mountPartsManagerDashboardExpress } from "./parts-manager-dashboard.express";

export function createPartsManagerDashboardModule(options: PartsManagerDashboardServiceOptions) {
  const service = new PartsManagerDashboardService(options);
  return Object.freeze({
    service,
    router: createPartsManagerDashboardRouter(service),
    mountExpress: mountPartsManagerDashboardExpress,
  });
}
