/**
 * AIMI Context Layer
 * Master Blueprint V2 / aimi.md §2 / BACKEND-STRUCTURE §6
 * Factory only. No Nest runtime. No global AIMI Context instance.
 */

import { AimiContextService, type AimiContextServiceOptions } from "./aimi-context.service";

export class AimiContextModule {
  static create(options: AimiContextServiceOptions): AimiContextService {
    return new AimiContextService(options);
  }
}

export { AimiContextService } from "./aimi-context.service";
export type { AimiContextServiceOptions } from "./aimi-context.service";
export type {
  AimiContext,
  AimiContextBuild,
  AimiContextSource,
} from "./aimi-context.interface";
export { freezeAimiContext } from "./aimi-context.interface";
export { buildAimiContext } from "./aimi-context-builder";
export type { AimiContextBuildResult } from "./aimi-context-builder";
export {
  containsEngine,
  selectEngineInput,
  selectPrior,
  selectSnapshot,
  tenantMatches,
} from "./aimi-context-rules";
export { incomingEventFromAimiContext } from "./aimi-context-events";
