import { PmService, type PmServiceOptions } from "./pm.service";

export class PmModule {
  static create(options: PmServiceOptions): PmService {
    return new PmService(options);
  }
}

export { PmService } from "./pm.service";
export type { PmServiceOptions } from "./pm.service";
