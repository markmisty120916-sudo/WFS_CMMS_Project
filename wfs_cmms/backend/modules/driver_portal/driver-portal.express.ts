import type { IncomingMessage, ServerResponse } from "http";
import type { ContextDto } from "@/dto/context.dto";
import { createDriverPortalRouter } from "./driver-portal.routes";
import type { DriverPortalService } from "./driver-portal.service";

export type DriverPortalExpressApp = {
  use(
    path: string,
    handler: (req: IncomingMessage, res: ServerResponse, next: () => void) => void,
  ): unknown;
};

export function mountDriverPortalExpress(
  app: DriverPortalExpressApp,
  service: DriverPortalService,
  toDto: (req: IncomingMessage) => ContextDto,
): void {
  const router = createDriverPortalRouter(service);
  app.use("/v1", (req, res, next) => {
    void (async () => {
      const handled = await router(req, res, toDto(req));
      if (handled === false) {
        next();
      }
    })();
  });
}
