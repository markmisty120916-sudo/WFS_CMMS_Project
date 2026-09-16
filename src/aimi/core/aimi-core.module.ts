/**
 * AIMI Core
 * Master Blueprint V2 / BACKEND-STRUCTURE §6 / aimi.md §2
 * Factory only. No Nest runtime. No global AIMI Core instance.
 */

import { AimiCoreService, type AimiCoreServiceOptions } from "./aimi-core.service";

export class AimiCoreModule {
  static create(options: AimiCoreServiceOptions): AimiCoreService {
    return new AimiCoreService(options);
  }
}

export { AimiCoreService } from "./aimi-core.service";
export type { AimiCoreServiceOptions } from "./aimi-core.service";
export type { AimiCoreContext } from "./aimi-core-context.interface";
export type { AimiCoreOutput } from "./aimi-core-output.interface";
export { freezeAimiCoreOutput } from "./aimi-core-output.interface";
export type { AimiEngineName } from "./aimi-core-engine-map";
export { AIMI_ENGINE_ORDER, sequenceEngines } from "./aimi-core-engine-map";
export { enginesForEventType } from "./aimi-core-event-router";
export { aggregateAimiCore } from "./aimi-core-aggregator";
export {
  filterEnginesForRole,
  impactAreaFromEngines,
  insightSeverityFromSeverity,
  insightTypeFromEventType,
  isEngineAllowedForRole,
} from "./aimi-core-rules";
export { incomingEventFromAimiCore } from "./aimi-core-events";
