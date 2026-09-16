/**
 * AIMI Deterministic Pipeline
 * Master Blueprint V2 / aimi.md §12 / TENANT-ISOLATION
 * Immutable pipeline envelope. Engine order and merge come from AIMI Core only.
 */

import type { AimiCoreOutput } from "../core/aimi-core-output.interface";
import type { AimiEngineName } from "../core/aimi-core-engine-map";
import type { AimiSession, AimiSessionSource } from "../session/aimi-session.interface";

export type AimiPipelineSource = AimiSessionSource & {
  readonly previous_pipeline: AimiPipeline | null;
};

export type AimiPipeline = {
  readonly session: AimiSession;
  readonly engines_ordered: readonly AimiEngineName[];
  readonly output: AimiCoreOutput;
};

export type AimiPipelineBuild = {
  readonly session: AimiSession;
  readonly engines_ordered: readonly AimiEngineName[];
};

export function freezeAimiPipeline(pipeline: AimiPipeline): AimiPipeline {
  const engines: AimiEngineName[] = [];
  let index = 0;
  while (index < pipeline.engines_ordered.length) {
    engines.push(pipeline.engines_ordered[index]);
    index = index + 1;
  }
  return Object.freeze({
    session: pipeline.session,
    engines_ordered: Object.freeze(engines),
    output: pipeline.output,
  });
}
