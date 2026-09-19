import { createSilentMasterKeyDashboardRouter } from "./silent-master-key-dashboard.routes";
import { SilentMasterKeyDashboardService, type SilentMasterKeyDashboardServiceOptions } from "./silent-master-key-dashboard.service";
import { mountSilentMasterKeyDashboardExpress } from "./silent-master-key-dashboard.express";

export function createSilentMasterKeyDashboardModule(options: SilentMasterKeyDashboardServiceOptions) {
  const service = new SilentMasterKeyDashboardService(options);
  return Object.freeze({
    service,
    router: createSilentMasterKeyDashboardRouter(service),
    mountExpress: mountSilentMasterKeyDashboardExpress,
  });
}
