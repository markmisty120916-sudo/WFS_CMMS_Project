import type { IncomingMessage, ServerResponse } from "http";
import type { ContextDto } from "../../../../src/core/dto/context.dto";
import { createAssetManagerRouter } from "./asset-manager.routes";
import type { AssetManagerService } from "./asset-manager.service";

export type AssetManagerExpressRequest = IncomingMessage;
export type AssetManagerExpressResponse = ServerResponse;

export type AssetManagerExpressApp = {
  use(
    path: string,
    handler: (req: IncomingMessage, res: ServerResponse, next: () => void) => void,
  ): unknown;
};

export function mountAssetManagerExpress(
  app: AssetManagerExpressApp,
  service: AssetManagerService,
  toDto: (req: IncomingMessage) => ContextDto,
): void {
  const router = createAssetManagerRouter(service);
  app.use("/v1", (req, res, next) => {
    void (async () => {
      const handled = await router(req, res, toDto(req));
      if (handled === false) {
        next();
      }
    })();
  });
}
