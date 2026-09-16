/**
 * AIMI Core
 * Master Blueprint V2 / aimi.md §2–§3 / BACKEND-STRUCTURE §6
 * Eight isolated engines. Names are frozen.
 */

export type AimiEngineName =
  | "SeverityEngine"
  | "RoutingEngine"
  | "SchedulingEngine"
  | "DiagnosticEngine"
  | "PredictiveEngine"
  | "LearningEngine"
  | "MultilingualNlpEngine"
  | "VoiceNlpEngine";

export const AIMI_ENGINE_ORDER: readonly AimiEngineName[] = Object.freeze([
  "VoiceNlpEngine",
  "MultilingualNlpEngine",
  "SeverityEngine",
  "PredictiveEngine",
  "RoutingEngine",
  "SchedulingEngine",
  "DiagnosticEngine",
  "LearningEngine",
]);

export function sequenceEngines(selected: readonly AimiEngineName[]): readonly AimiEngineName[] {
  const sequenced: AimiEngineName[] = [];
  let skip_multilingual = false;
  let selected_index = 0;
  while (selected_index < selected.length) {
    if (selected[selected_index] === "VoiceNlpEngine") {
      skip_multilingual = true;
    }
    selected_index = selected_index + 1;
  }
  let order_index = 0;
  while (order_index < AIMI_ENGINE_ORDER.length) {
    const engine = AIMI_ENGINE_ORDER[order_index];
    order_index = order_index + 1;
    if (engine === "MultilingualNlpEngine") {
      if (skip_multilingual === true) {
        continue;
      }
    }
    let found = false;
    let find_index = 0;
    while (find_index < selected.length) {
      if (selected[find_index] === engine) {
        found = true;
      }
      find_index = find_index + 1;
    }
    if (found === true) {
      sequenced.push(engine);
    }
  }
  return sequenced;
}
