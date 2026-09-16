/**
 * AIMI Context Layer
 * Master Blueprint V2 / aimi.md §2 / §12
 * Deterministic freeze of coded inputs. No assumed engine payloads.
 */

import type { ErrorType } from "../../core/errors/error-types";
import { sequenceEngines } from "../core/aimi-core-engine-map";
import { enginesForEventType } from "../core/aimi-core-event-router";
import { filterEnginesForRole } from "../core/aimi-core-rules";
import {
  selectEngineInput,
  selectPrior,
  selectSnapshot,
} from "./aimi-context-rules";
import {
  freezeAimiContext,
  type AimiContextBuild,
  type AimiContextSource,
} from "./aimi-context.interface";

export type AimiContextBuildResult =
  | { success: true; error_code: "none"; value: AimiContextBuild }
  | { success: false; error_code: ErrorType; value: null };

function fail(error_code: ErrorType): AimiContextBuildResult {
  return { success: false, error_code, value: null };
}

export function buildAimiContext(source: AimiContextSource): AimiContextBuildResult {
  if (source.tenant_id === "") {
    return fail("tenant_id required");
  }
  if (source.user_id === "") {
    return fail("user_id required");
  }
  if (source.timestamp === "") {
    return fail("timestamp required");
  }
  if (source.event.event_id === "") {
    return fail("event_id required");
  }
  if (source.event.event_type === "") {
    return fail("event_type required");
  }
  if (source.event.tenant_id !== source.tenant_id) {
    return fail("tenant_id mismatch");
  }
  if (source.event.user_id !== source.user_id) {
    return fail("dto invalid");
  }
  if (source.event.role !== source.role) {
    return fail("role unauthorized");
  }

  const mapped = enginesForEventType(source.event.event_type);
  const allowed = filterEnginesForRole(mapped, source.role);
  const engines_selected = sequenceEngines(allowed);

  const workorder = selectSnapshot(
    source.tenant_id,
    source.role,
    "workorder",
    source.workorder_snapshot,
  );
  if (workorder.error_code !== "none") {
    return fail(workorder.error_code);
  }
  const diagnostic = selectSnapshot(
    source.tenant_id,
    source.role,
    "diagnostic",
    source.diagnostic_snapshot,
  );
  if (diagnostic.error_code !== "none") {
    return fail(diagnostic.error_code);
  }
  const pm = selectSnapshot(source.tenant_id, source.role, "pm", source.pm_snapshot);
  if (pm.error_code !== "none") {
    return fail(pm.error_code);
  }

  const severity_inputs = selectEngineInput(
    "SeverityEngine",
    mapped,
    source.role,
    source.tenant_id,
    source.severity_inputs,
  );
  if (severity_inputs.error_code !== "none") {
    return fail(severity_inputs.error_code);
  }
  const routing_inputs = selectEngineInput(
    "RoutingEngine",
    mapped,
    source.role,
    source.tenant_id,
    source.routing_inputs,
  );
  if (routing_inputs.error_code !== "none") {
    return fail(routing_inputs.error_code);
  }
  const scheduling_inputs = selectEngineInput(
    "SchedulingEngine",
    mapped,
    source.role,
    source.tenant_id,
    source.scheduling_inputs,
  );
  if (scheduling_inputs.error_code !== "none") {
    return fail(scheduling_inputs.error_code);
  }
  const predictive_inputs = selectEngineInput(
    "PredictiveEngine",
    mapped,
    source.role,
    source.tenant_id,
    source.predictive_inputs,
  );
  if (predictive_inputs.error_code !== "none") {
    return fail(predictive_inputs.error_code);
  }
  const diagnostic_inputs = selectEngineInput(
    "DiagnosticEngine",
    mapped,
    source.role,
    source.tenant_id,
    source.diagnostic_inputs,
  );
  if (diagnostic_inputs.error_code !== "none") {
    return fail(diagnostic_inputs.error_code);
  }
  const learning_inputs = selectEngineInput(
    "LearningEngine",
    mapped,
    source.role,
    source.tenant_id,
    source.learning_inputs,
  );
  if (learning_inputs.error_code !== "none") {
    return fail(learning_inputs.error_code);
  }
  const multilingual_inputs = selectEngineInput(
    "MultilingualNlpEngine",
    mapped,
    source.role,
    source.tenant_id,
    source.multilingual_inputs,
  );
  if (multilingual_inputs.error_code !== "none") {
    return fail(multilingual_inputs.error_code);
  }
  const voice_inputs = selectEngineInput(
    "VoiceNlpEngine",
    mapped,
    source.role,
    source.tenant_id,
    source.voice_inputs,
  );
  if (voice_inputs.error_code !== "none") {
    return fail(voice_inputs.error_code);
  }

  const prior_severity = selectPrior(source.tenant_id, source.prior_severity);
  if (prior_severity.error_code !== "none") {
    return fail(prior_severity.error_code);
  }
  const prior_routing = selectPrior(source.tenant_id, source.prior_routing);
  if (prior_routing.error_code !== "none") {
    return fail(prior_routing.error_code);
  }
  const prior_scheduling = selectPrior(source.tenant_id, source.prior_scheduling);
  if (prior_scheduling.error_code !== "none") {
    return fail(prior_scheduling.error_code);
  }
  const prior_predictive = selectPrior(source.tenant_id, source.prior_predictive);
  if (prior_predictive.error_code !== "none") {
    return fail(prior_predictive.error_code);
  }
  const prior_diagnostics = selectPrior(source.tenant_id, source.prior_diagnostics);
  if (prior_diagnostics.error_code !== "none") {
    return fail(prior_diagnostics.error_code);
  }
  const prior_learning = selectPrior(source.tenant_id, source.prior_learning);
  if (prior_learning.error_code !== "none") {
    return fail(prior_learning.error_code);
  }
  const prior_multilingual = selectPrior(source.tenant_id, source.prior_multilingual);
  if (prior_multilingual.error_code !== "none") {
    return fail(prior_multilingual.error_code);
  }
  const prior_voice = selectPrior(source.tenant_id, source.prior_voice);
  if (prior_voice.error_code !== "none") {
    return fail(prior_voice.error_code);
  }

  const context = freezeAimiContext({
    tenant_id: source.tenant_id,
    user_id: source.user_id,
    role: source.role,
    timestamp: source.timestamp,
    event: source.event,
    workorder_snapshot: workorder.value,
    diagnostic_snapshot: diagnostic.value,
    pm_snapshot: pm.value,
    severity_inputs: severity_inputs.value,
    routing_inputs: routing_inputs.value,
    scheduling_inputs: scheduling_inputs.value,
    predictive_inputs: predictive_inputs.value,
    diagnostic_inputs: diagnostic_inputs.value,
    learning_inputs: learning_inputs.value,
    multilingual_inputs: multilingual_inputs.value,
    voice_inputs: voice_inputs.value,
    prior_severity: prior_severity.value,
    prior_routing: prior_routing.value,
    prior_scheduling: prior_scheduling.value,
    prior_predictive: prior_predictive.value,
    prior_diagnostics: prior_diagnostics.value,
    prior_learning: prior_learning.value,
    prior_multilingual: prior_multilingual.value,
    prior_voice: prior_voice.value,
  });

  return {
    success: true,
    error_code: "none",
    value: Object.freeze({
      context,
      engines_selected,
    }),
  };
}
