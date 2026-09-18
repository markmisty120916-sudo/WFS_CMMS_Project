import type { IncomingMessage, ServerResponse } from "http";
import type { ContextDto } from "../../../../src/core/dto/context.dto";
import { createFleetManagerDashboardRouter } from "./fleet-manager-dashboard.routes";
import type { FleetManagerDashboardService } from "./fleet-manager-dashboard.service";

export type FleetManagerExpressApp = {
  use(
    path: string,
    handler: (req: IncomingMessage, res: ServerResponse, next: () => void) => void,
  ): unknown;
};

export function mountFleetManagerDashboardExpress(
  app: FleetManagerExpressApp,
  service: FleetManagerDashboardService,
  toDto: (req: IncomingMessage) => ContextDto,
): void {
  const router = createFleetManagerDashboardRouter(service);
  app.use("/v1", (req, res, next) => {
    void (async () => {
      const handled = await router(req, res, toDto(req));
      if (handled === false) {
        next();
      }
    })();
  });
}
