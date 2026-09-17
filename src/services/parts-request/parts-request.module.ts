import { PartsRequestService, type PartsRequestServiceOptions } from "./parts-request.service";

export class PartsRequestModule {
  static create(options: PartsRequestServiceOptions): PartsRequestService {
    return new PartsRequestService(options);
  }
}

export { PartsRequestService } from "./parts-request.service";
export type { PartsRequestServiceOptions } from "./parts-request.service";
