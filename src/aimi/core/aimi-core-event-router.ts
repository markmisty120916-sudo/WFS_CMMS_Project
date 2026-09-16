/**
 * AIMI Core
 * Master Blueprint V2 / aimi.md §2 / EVENT-BUS-SPEC
 * Maps EventBus whitelist types to AIMI engines. No invented event types.
 */

import type { AimiEngineName } from "./aimi-core-engine-map";

export function enginesForEventType(event_type: string): readonly AimiEngineName[] {
  if (event_type === "workorder.created") {
    return Object.freeze(["SeverityEngine"]);
  }
  if (event_type === "workorder.updated") {
    return Object.freeze(["SeverityEngine"]);
  }
  if (event_type === "workorder.assigned") {
    return Object.freeze(["SchedulingEngine"]);
  }
  if (event_type === "workorder.started") {
    return Object.freeze(["DiagnosticEngine"]);
  }
  if (event_type === "workorder.completed") {
    return Object.freeze(["PredictiveEngine", "LearningEngine"]);
  }
  if (event_type === "pm.completed") {
    return Object.freeze(["PredictiveEngine"]);
  }
  if (event_type === "pm.finding.logged") {
    return Object.freeze(["SeverityEngine"]);
  }
  if (event_type === "diagnostic.step.completed") {
    return Object.freeze(["LearningEngine"]);
  }
  if (event_type === "diagnostic.verification.completed") {
    return Object.freeze(["LearningEngine"]);
  }
  if (event_type === "routing.assigned") {
    return Object.freeze(["SchedulingEngine"]);
  }
  if (event_type === "voice.command.received") {
    return Object.freeze(["VoiceNlpEngine"]);
  }
  return Object.freeze([]);
}
