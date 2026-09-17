import { ComplianceService, type ComplianceServiceOptions } from "./compliance.service";

export class ComplianceModule {
  static create(options: ComplianceServiceOptions): ComplianceService {
    return new ComplianceService(options);
  }
}

export { ComplianceService } from "./compliance.service";
export type { ComplianceServiceOptions } from "./compliance.service";
