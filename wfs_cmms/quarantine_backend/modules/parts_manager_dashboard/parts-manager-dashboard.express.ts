import type { IncomingMessage, ServerResponse } from "http";
import type { ContextDto } from "../../../../src/core/dto/context.dto";
import { createPartsManagerDashboardRouter } from "./parts-manager-dashboard.routes";
import type { PartsManagerDashboardService } from "./parts-manager-dashboard.service";

export type PartsManagerExpressApp = {
  use(
    path: string,
    handler: (req: IncomingMessage, res: ServerResponse, next: () => void) => void,
  ): unknown;
};

export function mountPartsManagerDashboardExpress(
  app: PartsManagerExpressApp,
  service: PartsManagerDashboardService,
  toDto: (req: IncomingMessage) => ContextDto,
): void {
  const router = createPartsManagerDashboardRouter(service);
  app.use("/v1", (req, res, next) => {
    void (async () => {
      const handled = await router(req, res, toDto(req));
      if (handled === false) {
        next();
      }
    })();
  });
}
