import type { IncomingMessage, ServerResponse } from "http";
import type { ContextDto } from "../../../../src/core/dto/context.dto";
import { GLOBAL_DASHBOARD_INTEGRATION_RELEASE_PREP_ROUTES } from "./api/global-dashboard-integration.api.release-prep";
import { createGlobalDashboardIntegrationReleasePrepController } from "./global-dashboard-integration.release-prep.controller";

function matchPath(pattern: string, pathname: string): boolean {
  const patternParts = pattern.split("/");
  const pathParts = pathname.replace("/v1", "").split("/");
  if (patternParts.length !== pathParts.length) {
    return false;
  }
  let index = 0;
  while (index < patternParts.length) {
    if (patternParts[index] !== pathParts[index]) {
      return false;
    }
    index = index + 1;
  }
  return true;
}

export function createGlobalDashboardIntegrationReleasePrepRouter() {
  const controller = createGlobalDashboardIntegrationReleasePrepController();
  return async function globalDashboardIntegrationReleasePrepRouter(
    req: IncomingMessage,
    res: ServerResponse,
    dto: ContextDto,
  ): Promise<boolean> {
    const rawUrl = req.url === undefined ? "" : req.url;
    const url = rawUrl.split("?")[0];
    const method = req.method === undefined ? "GET" : req.method;
    let index = 0;
    while (index < GLOBAL_DASHBOARD_INTEGRATION_RELEASE_PREP_ROUTES.length) {
      const route = GLOBAL_DASHBOARD_INTEGRATION_RELEASE_PREP_ROUTES[index];
      if (route.method === method && matchPath(route.path, url) === true) {
        if (dto.tenant_id === "") {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: false, error: "tenant_id mismatch" }));
          return true;
        }
        await controller.handle(req, res, dto, route.operation);
        return true;
      }
      index = index + 1;
    }
    return false;
  };
}
