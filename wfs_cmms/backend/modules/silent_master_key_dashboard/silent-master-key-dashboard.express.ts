import type { IncomingMessage, ServerResponse } from "http";
import type { ContextDto } from "../../../../src/core/dto/context.dto";
import { createSilentMasterKeyDashboardRouter } from "./silent-master-key-dashboard.routes";
import type { SilentMasterKeyDashboardService } from "./silent-master-key-dashboard.service";

export type SilentMasterKeyExpressApp = {
  use(
    path: string,
    handler: (req: IncomingMessage, res: ServerResponse, next: () => void) => void,
  ): unknown;
};

export function mountSilentMasterKeyDashboardExpress(
  app: SilentMasterKeyExpressApp,
  service: SilentMasterKeyDashboardService,
  toDto: (req: IncomingMessage) => ContextDto,
): void {
  const router = createSilentMasterKeyDashboardRouter(service);
  app.use("/v1", (req, res, next) => {
    void (async () => {
      const handled = await router(req, res, toDto(req));
      if (handled === false) {
        next();
      }
    })();
  });
}
