/**
 * AIMI Core
 * Master Blueprint V2 / aimi.md §2 / RBAC / TENANT-ISOLATION
 * Role filters reuse engine rules. No AIMI Core bypass.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import { isRoleAllowedToDiagnose } from "../diagnostics/diagnostics-rules";
import { isRoleAllowedToGenerateLearning } from "../learning/learning-rules";
import { isRoleAllowedToTranslate } from "../multilingual-nlp/multilingual-rules";
import { isRoleAllowedToForecast } from "../predictive/predictive-rules";
import { isRoleAllowedToRoute } from "../routing/routing-rules";
import { isRoleAllowedToSchedule } from "../scheduling/scheduling-rules";
import { isRoleAllowedToClassify } from "../severity/severity-rules";
import { isRoleAllowedToSpeak } from "../voice-nlp/voice-rules";
import type { AimiEngineName } from "./aimi-core-engine-map";

export function isEngineAllowedForRole(engine: AimiEngineName, role: DtoRole): boolean {
  if (engine === "SeverityEngine") {
    return isRoleAllowedToClassify(role);
  }
  if (engine === "RoutingEngine") {
    return isRoleAllowedToRoute(role);
  }
  if (engine === "SchedulingEngine") {
    return isRoleAllowedToSchedule(role);
  }
  if (engine === "DiagnosticEngine") {
    return isRoleAllowedToDiagnose(role);
  }
  if (engine === "PredictiveEngine") {
    return isRoleAllowedToForecast(role);
  }
  if (engine === "LearningEngine") {
    return isRoleAllowedToGenerateLearning(role);
  }
  if (engine === "MultilingualNlpEngine") {
    return isRoleAllowedToTranslate(role);
  }
  return isRoleAllowedToSpeak(role);
}

export function filterEnginesForRole(
  engines: readonly AimiEngineName[],
  role: DtoRole,
): readonly AimiEngineName[] {
  const filtered: AimiEngineName[] = [];
  let index = 0;
  while (index < engines.length) {
    const engine = engines[index];
    index = index + 1;
    if (isEngineAllowedForRole(engine, role) === true) {
      filtered.push(engine);
    }
  }
  return filtered;
}

export function impactAreaFromEngines(engines: readonly AimiEngineName[]): string {
  let index = 0;
  while (index < engines.length) {
    if (engines[index] === "SchedulingEngine") {
      return "scheduling";
    }
    index = index + 1;
  }
  index = 0;
  while (index < engines.length) {
    if (engines[index] === "RoutingEngine") {
      return "routing";
    }
    index = index + 1;
  }
  index = 0;
  while (index < engines.length) {
    if (engines[index] === "PredictiveEngine") {
      return "predictive";
    }
    index = index + 1;
  }
  return "workflow speed";
}

export function insightSeverityFromSeverity(severity: string | null): "Low" | "Medium" | "High" | "Critical" {
  if (severity === "S1") {
    return "Critical";
  }
  if (severity === "S2") {
    return "High";
  }
  if (severity === "S3") {
    return "Medium";
  }
  return "Low";
}

export function insightTypeFromEventType(event_type: string): "technician" | "fleet" | "asset" {
  if (event_type === "pm.completed") {
    return "asset";
  }
  if (event_type === "pm.finding.logged") {
    return "asset";
  }
  return "technician";
}
