import type { IncomingMessage, ServerResponse } from "http";
import type { ContextDto } from "../../../../src/core/dto/context.dto";
import { createComplianceDashboardRouter } from "./compliance-dashboard.routes";
import type { ComplianceDashboardService } from "./compliance-dashboard.service";

export type ComplianceDashboardExpressApp = {
  use(
    path: string,
    handler: (req: IncomingMessage, res: ServerResponse, next: () => void) => void,
  ): unknown;
};

export function mountComplianceDashboardExpress(
  app: ComplianceDashboardExpressApp,
  service: ComplianceDashboardService,
  toDto: (req: IncomingMessage) => ContextDto,
): void {
  const router = createComplianceDashboardRouter(service);
  app.use("/v1", (req, res, next) => {
    void (async () => {
      const handled = await router(req, res, toDto(req));
      if (handled === false) {
        next();
      }
    })();
  });
}
