import type { IncomingMessage, ServerResponse } from "http";
import type { ContextDto } from "../../../../src/core/dto/context.dto";
import { FLEET_MANAGER_API_ROUTES } from "./api/fleet-manager-dashboard.api.contract";
import { createFleetManagerDashboardController } from "./fleet-manager-dashboard.controller";
import type { FleetManagerDashboardService } from "./fleet-manager-dashboard.service";

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

function queryFromUrl(url: string): Readonly<Record<string, string>> {
  const queryIndex = url.indexOf("?");
  if (queryIndex < 0) {
    return {};
  }
  const query = url.slice(queryIndex + 1);
  const pairs = query.split("&");
  const params: Record<string, string> = {};
  let index = 0;
  while (index < pairs.length) {
    const pair = pairs[index];
    const eq = pair.indexOf("=");
    if (eq > 0) {
      params[decodeURIComponent(pair.slice(0, eq))] = decodeURIComponent(pair.slice(eq + 1));
    }
    index = index + 1;
  }
  return params;
}

export function createFleetManagerDashboardRouter(service: FleetManagerDashboardService) {
  const controller = createFleetManagerDashboardController(service);
  return async function fleetManagerDashboardRouter(req: IncomingMessage, res: ServerResponse, dto: ContextDto): Promise<boolean> {
    const rawUrl = req.url === undefined ? "" : req.url;
    const url = rawUrl.split("?")[0];
    const query = queryFromUrl(rawUrl);
    const method = req.method === undefined ? "GET" : req.method;
    let index = 0;
    while (index < FLEET_MANAGER_API_ROUTES.length) {
      const route = FLEET_MANAGER_API_ROUTES[index];
      if (route.method === method && matchPath(route.path, url) === true) {
        await controller.handle(req, res, dto, route.operation, query);
        return true;
      }
      index = index + 1;
    }
    return false;
  };
}
