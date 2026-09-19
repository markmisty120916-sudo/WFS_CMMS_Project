import type { IncomingMessage, ServerResponse } from "http";
import type { ContextDto } from "../../../../src/core/dto/context.dto";
import { DRIVER_PORTAL_API_ROUTES } from "./api/driver-portal.api.contract";
import { createDriverPortalController } from "./driver-portal.controller";
import type { DriverPortalService } from "./driver-portal.service";

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

export function createDriverPortalRouter(service: DriverPortalService) {
  const controller = createDriverPortalController(service);
  return async function driverPortalRouter(req: IncomingMessage, res: ServerResponse, dto: ContextDto): Promise<boolean> {
    const rawUrl = req.url === undefined ? "" : req.url;
    const url = rawUrl.split("?")[0];
    const query = queryFromUrl(rawUrl);
    const method = req.method === undefined ? "GET" : req.method;
    let index = 0;
    while (index < DRIVER_PORTAL_API_ROUTES.length) {
      const route = DRIVER_PORTAL_API_ROUTES[index];
      if (route.method === method && matchPath(route.path, url) === true) {
        await controller.handle(req, res, dto, route.operation, query);
        return true;
      }
      index = index + 1;
    }
    return false;
  };
}
