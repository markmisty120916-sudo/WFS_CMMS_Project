/**
 * AIMI Deterministic Pipeline
 * Master Blueprint V2 / aimi.md §12 / RBAC / TENANT-ISOLATION
 * Order is AIMI_ENGINE_ORDER. Merge never rewrites an engine output.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type { ErrorType } from "../../core/errors/error-types";
import { sequenceEngines, type AimiEngineName } from "../core/aimi-core-engine-map";
import { aggregateAimiCore } from "../core/aimi-core-aggregator";
import type { AimiCoreOutput } from "../core/aimi-core-output.interface";
import { containsEngine } from "../context/aimi-context-rules";
import type { AimiPipeline } from "./aimi-pipeline.interface";

export type TenantScoped = {
  readonly tenant_id: string;
};

export function enginesInFrozenOrder(engines: readonly AimiEngineName[]): boolean {
  const sequenced = sequenceEngines(engines);
  if (sequenced.length !== engines.length) {
    return false;
  }
  let index = 0;
  while (index < engines.length) {
    if (engines[index] !== sequenced[index]) {
      return false;
    }
    index = index + 1;
  }
  return true;
}

export function pipelineIdentityError(
  session_id: string,
  tenant_id: string,
  user_id: string,
  role: DtoRole,
  previous: AimiPipeline | null,
): ErrorType | "none" {
  if (previous === null) {
    return "none";
  }
  if (previous.session.session_id !== session_id) {
    return "entity_id mismatch";
  }
  if (previous.session.tenant_id !== tenant_id) {
    return "tenant_id mismatch";
  }
  if (previous.output.tenant_id !== tenant_id) {
    return "tenant_id mismatch";
  }
  if (previous.session.user_id !== user_id) {
    return "dto invalid";
  }
  if (previous.session.role !== role) {
    return "role unauthorized";
  }
  if (previous.output.role !== role) {
    return "role unauthorized";
  }
  return "none";
}

export function mergeSlot<T extends TenantScoped>(
  tenant_id: string,
  previous: T | null,
  current: T | null,
): { error_code: ErrorType | "none"; value: T | null } {
  if (current !== null) {
    if (current.tenant_id !== tenant_id) {
      return { error_code: "tenant_id mismatch", value: null };
    }
    return { error_code: "none", value: current };
  }
  if (previous !== null) {
    if (previous.tenant_id !== tenant_id) {
      return { error_code: "tenant_id mismatch", value: null };
    }
    return { error_code: "none", value: previous };
  }
  return { error_code: "none", value: null };
}

export function mergeEngineNames(
  previous: readonly AimiEngineName[],
  current: readonly AimiEngineName[],
): readonly AimiEngineName[] {
  const combined: AimiEngineName[] = [];
  let index = 0;
  while (index < previous.length) {
    combined.push(previous[index]);
    index = index + 1;
  }
  index = 0;
  while (index < current.length) {
    if (containsEngine(combined, current[index]) === false) {
      combined.push(current[index]);
    }
    index = index + 1;
  }
  return sequenceEngines(combined);
}

export function mergePipelineOutputs(
  tenant_id: string,
  user_id: string,
  role: DtoRole,
  timestamp: string,
  event_id: string,
  event_type: string,
  previous: AimiCoreOutput | null,
  current: AimiCoreOutput,
): { error_code: ErrorType | "none"; value: AimiCoreOutput | null } {
  if (current.tenant_id !== tenant_id) {
    return { error_code: "tenant_id mismatch", value: null };
  }
  if (current.user_id !== user_id) {
    return { error_code: "dto invalid", value: null };
  }
  if (current.role !== role) {
    return { error_code: "role unauthorized", value: null };
  }
  if (enginesInFrozenOrder(current.engines_run) === false) {
    return { error_code: "dto invalid", value: null };
  }

  let previous_engines: readonly AimiEngineName[] = Object.freeze([]);
  let previous_severity = null;
  let previous_routing = null;
  let previous_scheduling = null;
  let previous_predictive = null;
  let previous_diagnostics = null;
  let previous_learning = null;
  let previous_multilingual = null;
  let previous_voice = null;
  if (previous !== null) {
    if (previous.tenant_id !== tenant_id) {
      return { error_code: "tenant_id mismatch", value: null };
    }
    if (enginesInFrozenOrder(previous.engines_run) === false) {
      return { error_code: "dto invalid", value: null };
    }
    previous_engines = previous.engines_run;
    previous_severity = previous.severity;
    previous_routing = previous.routing;
    previous_scheduling = previous.scheduling;
    previous_predictive = previous.predictive;
    previous_diagnostics = previous.diagnostics;
    previous_learning = previous.learning;
    previous_multilingual = previous.multilingual;
    previous_voice = previous.voice;
  }

  const severity = mergeSlot(tenant_id, previous_severity, current.severity);
  if (severity.error_code !== "none") {
    return { error_code: severity.error_code, value: null };
  }
  const routing = mergeSlot(tenant_id, previous_routing, current.routing);
  if (routing.error_code !== "none") {
    return { error_code: routing.error_code, value: null };
  }
  const scheduling = mergeSlot(tenant_id, previous_scheduling, current.scheduling);
  if (scheduling.error_code !== "none") {
    return { error_code: scheduling.error_code, value: null };
  }
  const predictive = mergeSlot(tenant_id, previous_predictive, current.predictive);
  if (predictive.error_code !== "none") {
    return { error_code: predictive.error_code, value: null };
  }
  const diagnostics = mergeSlot(tenant_id, previous_diagnostics, current.diagnostics);
  if (diagnostics.error_code !== "none") {
    return { error_code: diagnostics.error_code, value: null };
  }
  const learning = mergeSlot(tenant_id, previous_learning, current.learning);
  if (learning.error_code !== "none") {
    return { error_code: learning.error_code, value: null };
  }
  const multilingual = mergeSlot(tenant_id, previous_multilingual, current.multilingual);
  if (multilingual.error_code !== "none") {
    return { error_code: multilingual.error_code, value: null };
  }
  const voice = mergeSlot(tenant_id, previous_voice, current.voice);
  if (voice.error_code !== "none") {
    return { error_code: voice.error_code, value: null };
  }

  return {
    error_code: "none",
    value: aggregateAimiCore({
      event_id,
      event_type,
      engines_run: mergeEngineNames(previous_engines, current.engines_run),
      severity: severity.value,
      routing: routing.value,
      scheduling: scheduling.value,
      predictive: predictive.value,
      diagnostics: diagnostics.value,
      learning: learning.value,
      multilingual: multilingual.value,
      voice: voice.value,
      tenant_id,
      user_id,
      role,
      timestamp,
    }),
  };
}
