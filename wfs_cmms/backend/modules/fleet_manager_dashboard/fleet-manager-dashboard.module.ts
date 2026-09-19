import { createFleetManagerDashboardRouter } from "./fleet-manager-dashboard.routes";
import { FleetManagerDashboardService, type FleetManagerDashboardServiceOptions } from "./fleet-manager-dashboard.service";
import { mountFleetManagerDashboardExpress } from "./fleet-manager-dashboard.express";

export function createFleetManagerDashboardModule(options: FleetManagerDashboardServiceOptions) {
  const service = new FleetManagerDashboardService(options);
  return Object.freeze({
    service,
    router: createFleetManagerDashboardRouter(service),
    mountExpress: mountFleetManagerDashboardExpress,
  });
}
