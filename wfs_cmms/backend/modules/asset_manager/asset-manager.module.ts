import type { AssetManagerService, AssetManagerServiceOptions } from "./asset-manager.service";
import { AssetManagerService as Service } from "./asset-manager.service";
import { createAssetManagerRouter } from "./asset-manager.routes";

export function createAssetManagerModule(options: AssetManagerServiceOptions) {
  const service: AssetManagerService = new Service(options);
  return Object.freeze({
    service,
    router: createAssetManagerRouter(service),
  });
}
