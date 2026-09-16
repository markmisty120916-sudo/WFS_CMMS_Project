/**
 * AIMI Deterministic Pipeline
 * Master Blueprint V2 / aimi.md §12
 * Freezes session context and Core engine order. No assumed sequencing.
 */

import type { ErrorType } from "../../core/errors/error-types";
import { buildAimiSession } from "../session/aimi-session-builder";
import { enginesInFrozenOrder, pipelineIdentityError } from "./aimi-pipeline-rules";
import type { AimiPipelineBuild, AimiPipelineSource } from "./aimi-pipeline.interface";

export type AimiPipelineBuildResult =
  | { success: true; error_code: "none"; value: AimiPipelineBuild }
  | { success: false; error_code: ErrorType; value: null };

function fail(error_code: ErrorType): AimiPipelineBuildResult {
  return { success: false, error_code, value: null };
}

export function buildAimiPipeline(source: AimiPipelineSource): AimiPipelineBuildResult {
  const identity = pipelineIdentityError(
    source.session_id,
    source.tenant_id,
    source.user_id,
    source.role,
    source.previous_pipeline,
  );
  if (identity !== "none") {
    return fail(identity);
  }

  const built = buildAimiSession(source);
  if (built.success === false || built.value === null) {
    return fail(built.error_code);
  }

  if (enginesInFrozenOrder(built.value.session.engines_selected) === false) {
    return fail("dto invalid");
  }

  return {
    success: true,
    error_code: "none",
    value: Object.freeze({
      session: built.value.session,
      engines_ordered: built.value.session.engines_selected,
    }),
  };
}
