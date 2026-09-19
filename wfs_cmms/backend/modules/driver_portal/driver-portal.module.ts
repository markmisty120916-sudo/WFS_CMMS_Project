import { createDriverPortalRouter } from "./driver-portal.routes";
import { DriverPortalService, type DriverPortalServiceOptions } from "./driver-portal.service";
import { mountDriverPortalExpress } from "./driver-portal.express";

export function createDriverPortalModule(options: DriverPortalServiceOptions) {
  const service = new DriverPortalService(options);
  return Object.freeze({
    service,
    router: createDriverPortalRouter(service),
    mountExpress: mountDriverPortalExpress,
  });
}
