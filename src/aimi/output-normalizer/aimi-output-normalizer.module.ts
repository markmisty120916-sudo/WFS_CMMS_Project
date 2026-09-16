/**
 * AIMI Output Normalizer
 * Master Blueprint V2 / aimi.md §12 / BACKEND-STRUCTURE §6
 * Factory only. No Nest runtime. No global AIMI Output Normalizer instance.
 */

import {
  AimiOutputNormalizerService,
  type AimiOutputNormalizerServiceOptions,
} from "./aimi-output-normalizer.service";

export class AimiOutputNormalizerModule {
  static create(options: AimiOutputNormalizerServiceOptions): AimiOutputNormalizerService {
    return new AimiOutputNormalizerService(options);
  }
}

export { AimiOutputNormalizerService } from "./aimi-output-normalizer.service";
export type { AimiOutputNormalizerServiceOptions } from "./aimi-output-normalizer.service";
export type {
  AimiInsightSeverity,
  AimiInsightType,
  AimiNormalizedOutput,
} from "./aimi-output-normalizer.interface";
export { freezeAimiNormalizedOutput } from "./aimi-output-normalizer.interface";
export { buildAimiOutputNormalizer } from "./aimi-output-normalizer-builder";
export type { AimiOutputNormalizerBuildResult } from "./aimi-output-normalizer-builder";
export {
  outputEngineSlotError,
  outputSlotRoleError,
  outputSlotTenantError,
  pipelineOutputIdentityError,
  sealedOutputError,
} from "./aimi-output-normalizer-rules";
export { incomingEventFromAimiNormalizedOutput } from "./aimi-output-normalizer-events";
