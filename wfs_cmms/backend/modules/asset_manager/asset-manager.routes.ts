import type { IncomingMessage, ServerResponse } from "http";
import type { ContextDto } from "@/dto/context.dto";
import { ASSET_MANAGER_API_ROUTES } from "./api/asset-manager.api.contract";
import { createAssetManagerController } from "./asset-manager.controller";
import type { AssetManagerService } from "./asset-manager.service";

function matchPath(pattern: string, pathname: string): Readonly<Record<string, string>> | null {
  const patternParts = pattern.split("/");
  const pathParts = pathname.replace("/v1", "").split("/");
  if (patternParts.length !== pathParts.length) {
    return null;
  }
  const params: Record<string, string> = {};
  let index = 0;
  while (index < patternParts.length) {
    const piece = patternParts[index];
    if (piece.startsWith("{") && piece.endsWith("}")) {
      params[piece.slice(1, piece.length - 1)] = decodeURIComponent(pathParts[index]);
    } else if (piece !== pathParts[index]) {
      return null;
    }
    index = index + 1;
  }
  return params;
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

export function createAssetManagerRouter(service: AssetManagerService) {
  const controller = createAssetManagerController(service);
  return async function assetManagerRouter(req: IncomingMessage, res: ServerResponse, dto: ContextDto): Promise<boolean> {
    const rawUrl = req.url === undefined ? "" : req.url;
    const url = rawUrl.split("?")[0];
    const query = queryFromUrl(rawUrl);
    const method = req.method === undefined ? "GET" : req.method;
    let index = 0;
    while (index < ASSET_MANAGER_API_ROUTES.length) {
      const route = ASSET_MANAGER_API_ROUTES[index];
      if (route.method === method) {
        const params = matchPath(route.path, url);
        if (params !== null) {
          await controller.handle(req, res, dto, route.operation, params, query);
          return true;
        }
      }
      index = index + 1;
    }
    return false;
  };
}
