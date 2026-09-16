/**
 * AIMI Deterministic Pipeline
 * Master Blueprint V2 / aimi.md §12 / BACKEND-STRUCTURE §6
 * Factory only. No Nest runtime. No global AIMI Pipeline instance.
 */

import { AimiPipelineService, type AimiPipelineServiceOptions } from "./aimi-pipeline.service";

export class AimiPipelineModule {
  static create(options: AimiPipelineServiceOptions): AimiPipelineService {
    return new AimiPipelineService(options);
  }
}

export { AimiPipelineService } from "./aimi-pipeline.service";
export type { AimiPipelineServiceOptions } from "./aimi-pipeline.service";
export type {
  AimiPipeline,
  AimiPipelineBuild,
  AimiPipelineSource,
} from "./aimi-pipeline.interface";
export { freezeAimiPipeline } from "./aimi-pipeline.interface";
export { buildAimiPipeline } from "./aimi-pipeline-builder";
export type { AimiPipelineBuildResult } from "./aimi-pipeline-builder";
export {
  enginesInFrozenOrder,
  mergeEngineNames,
  mergePipelineOutputs,
  mergeSlot,
  pipelineIdentityError,
} from "./aimi-pipeline-rules";
export { incomingEventFromAimiPipeline } from "./aimi-pipeline-events";
