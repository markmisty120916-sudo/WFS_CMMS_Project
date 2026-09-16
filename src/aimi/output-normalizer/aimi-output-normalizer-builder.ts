/**
 * AIMI Output Normalizer
 * Master Blueprint V2 / aimi.md §12 / EVENT-BUS-SPEC §8
 * Seals pipeline output into an immutable envelope. Payloads are not rewritten.
 */

import type { ErrorType } from "../../core/errors/error-types";
import { freezeAimiCoreOutput } from "../core/aimi-core-output.interface";
import {
  impactAreaFromEngines,
  insightSeverityFromSeverity,
  insightTypeFromEventType,
} from "../core/aimi-core-rules";
import { enginesInFrozenOrder } from "../pipeline/aimi-pipeline-rules";
import type { AimiPipeline } from "../pipeline/aimi-pipeline.interface";
import {
  freezeAimiNormalizedOutput,
  type AimiNormalizedOutput,
} from "./aimi-output-normalizer.interface";
import { sealedOutputError } from "./aimi-output-normalizer-rules";

export type AimiOutputNormalizerBuildResult =
  | { success: true; error_code: "none"; value: AimiNormalizedOutput }
  | { success: false; error_code: ErrorType; value: null };

function fail(error_code: ErrorType): AimiOutputNormalizerBuildResult {
  return { success: false, error_code, value: null };
}

export function buildAimiOutputNormalizer(pipeline: AimiPipeline): AimiOutputNormalizerBuildResult {
  if (pipeline.session.tenant_id === "") {
    return fail("tenant_id required");
  }
  if (pipeline.session.user_id === "") {
    return fail("user_id required");
  }
  if (pipeline.session.timestamp === "") {
    return fail("timestamp required");
  }
  if (pipeline.session.session_id === "") {
    return fail("entity_id required");
  }
  if (pipeline.session.context.event.event_id === "") {
    return fail("event_id required");
  }
  if (pipeline.session.context.event.event_type === "") {
    return fail("event_type required");
  }
  if (pipeline.session.context.event.tenant_id !== pipeline.session.tenant_id) {
    return fail("tenant_id mismatch");
  }
  if (enginesInFrozenOrder(pipeline.engines_ordered) === false) {
    return fail("dto invalid");
  }

  const output = freezeAimiCoreOutput(pipeline.output);
  const sealed = sealedOutputError(
    pipeline.session.tenant_id,
    pipeline.session.user_id,
    pipeline.session.role,
    pipeline.session.context.event.event_id,
    pipeline.session.context.event.event_type,
    output,
  );
  if (sealed !== "none") {
    return fail(sealed);
  }

  let severity_label: string | null = null;
  if (output.severity !== null) {
    severity_label = output.severity.severity;
  }

  const envelope = freezeAimiNormalizedOutput({
    tenant_id: pipeline.session.tenant_id,
    user_id: pipeline.session.user_id,
    role: pipeline.session.role,
    timestamp: pipeline.session.timestamp,
    session_id: pipeline.session.session_id,
    event_id: pipeline.session.context.event.event_id,
    event_type: pipeline.session.context.event.event_type,
    engines_ordered: pipeline.engines_ordered,
    engines_run: output.engines_run,
    output,
    insight_type: insightTypeFromEventType(output.event_type),
    insight_severity: insightSeverityFromSeverity(severity_label),
    impact_area: impactAreaFromEngines(output.engines_run),
  });

  return {
    success: true,
    error_code: "none",
    value: envelope,
  };
}
