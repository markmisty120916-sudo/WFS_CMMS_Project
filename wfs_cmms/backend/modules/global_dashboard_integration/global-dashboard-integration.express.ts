import type { IncomingMessage, ServerResponse } from "http";
import type { ContextDto } from "../../../../src/core/dto/context.dto";
import { createGlobalDashboardIntegrationRouter } from "./global-dashboard-integration.routes";
import { createGlobalDashboardIntegrationReleasePrepRouter } from "./global-dashboard-integration.release-prep.routes";
import type { GlobalDashboardIntegrationService } from "./global-dashboard-integration.service";

export type GlobalDashboardIntegrationExpressApp = {
  use(
    path: string,
    handler: (req: IncomingMessage, res: ServerResponse, next: () => void) => void,
  ): unknown;
};

export function mountGlobalDashboardIntegrationExpress(
  app: GlobalDashboardIntegrationExpressApp,
  service: GlobalDashboardIntegrationService,
  toDto: (req: IncomingMessage) => ContextDto,
): void {
  const router = createGlobalDashboardIntegrationRouter(service);
  const releasePrep = createGlobalDashboardIntegrationReleasePrepRouter();
  app.use("/v1", (req, res, next) => {
    void (async () => {
      const dto = toDto(req);
      const prepHandled = await releasePrep(req, res, dto);
      if (prepHandled === true) {
        return;
      }
      const handled = await router(req, res, dto);
      if (handled === false) {
        next();
      }
    })();
  });
}
