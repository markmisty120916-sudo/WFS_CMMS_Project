/**
 * AIMI Severity Engine
 * Master Blueprint V2 / BACKEND-STRUCTURE §6 / AIMI-SEVERITY
 * Factory only. No Nest runtime. No global severity instance.
 */

import {
  SeverityEngineService,
  type SeverityEngineServiceOptions,
} from "./severity-engine.service";

export class SeverityEngineModule {
  static create(options: SeverityEngineServiceOptions): SeverityEngineService {
    return new SeverityEngineService(options);
  }
}

export { SeverityEngineService } from "./severity-engine.service";
export type { SeverityEngineServiceOptions } from "./severity-engine.service";
export type { SeverityLevel } from "./severity-levels";
export { isHigherSeverity, severityRank } from "./severity-levels";
export type { SeverityInputs, SeverityMatch } from "./severity-inputs.interface";
export type { SeverityOutput } from "./severity-output.interface";
export { freezeSeverityOutput } from "./severity-output.interface";
export { evaluateSeverityTree } from "./severity-decision-tree";
export {
  doesOverrideReduceSafety,
  isRoleAllowedToClassify,
  isRoleAllowedToOverride,
} from "./severity-rules";
export { incomingEventFromSeverity } from "./severity-events";
