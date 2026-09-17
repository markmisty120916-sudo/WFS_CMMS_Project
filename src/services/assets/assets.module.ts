import { AssetsService, type AssetsServiceOptions } from "./assets.service";

export class AssetsModule {
  static create(options: AssetsServiceOptions): AssetsService {
    return new AssetsService(options);
  }
}

export { AssetsService } from "./assets.service";
export type { AssetsServiceOptions } from "./assets.service";
