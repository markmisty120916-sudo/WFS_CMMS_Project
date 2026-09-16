/**
 * AIMI Core
 * Master Blueprint V2 / aimi.md §12
 * Immutable aggregation surface. Missing engines stay null.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type { DiagnosticsOutput } from "../diagnostics/diagnostics-output.interface";
import type { LearningOutput } from "../learning/learning-output.interface";
import type { MultilingualOutput } from "../multilingual-nlp/multilingual-output.interface";
import type { PredictiveOutput } from "../predictive/predictive-output.interface";
import type { RoutingOutput } from "../routing/routing-output.interface";
import type { SchedulingOutput } from "../scheduling/scheduling-output.interface";
import type { SeverityOutput } from "../severity/severity-output.interface";
import type { VoiceOutput } from "../voice-nlp/voice-output.interface";
import type { AimiEngineName } from "./aimi-core-engine-map";

export type AimiCoreOutput = {
  readonly event_id: string;
  readonly event_type: string;
  readonly engines_run: readonly AimiEngineName[];
  readonly severity: SeverityOutput | null;
  readonly routing: RoutingOutput | null;
  readonly scheduling: SchedulingOutput | null;
  readonly predictive: PredictiveOutput | null;
  readonly diagnostics: DiagnosticsOutput | null;
  readonly learning: LearningOutput | null;
  readonly multilingual: MultilingualOutput | null;
  readonly voice: VoiceOutput | null;
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
  readonly timestamp: string;
};

export function freezeAimiCoreOutput(output: AimiCoreOutput): AimiCoreOutput {
  const engines: AimiEngineName[] = [];
  let index = 0;
  while (index < output.engines_run.length) {
    engines.push(output.engines_run[index]);
    index = index + 1;
  }
  return Object.freeze({
    event_id: output.event_id,
    event_type: output.event_type,
    engines_run: Object.freeze(engines),
    severity: output.severity,
    routing: output.routing,
    scheduling: output.scheduling,
    predictive: output.predictive,
    diagnostics: output.diagnostics,
    learning: output.learning,
    multilingual: output.multilingual,
    voice: output.voice,
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
    timestamp: output.timestamp,
  });
}
