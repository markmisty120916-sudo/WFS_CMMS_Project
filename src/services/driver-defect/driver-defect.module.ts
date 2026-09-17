import { DriverDefectService, type DriverDefectServiceOptions } from "./driver-defect.service";

export class DriverDefectModule {
  static create(options: DriverDefectServiceOptions): DriverDefectService {
    return new DriverDefectService(options);
  }
}

export { DriverDefectService } from "./driver-defect.service";
export type { DriverDefectServiceOptions } from "./driver-defect.service";
