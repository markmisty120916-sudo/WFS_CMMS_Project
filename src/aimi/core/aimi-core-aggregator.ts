/**
 * AIMI Core
 * Master Blueprint V2 / aimi.md §12
 * Aggregates engine results. Does not rewrite engine outputs.
 */

import type { AimiEngineName } from "./aimi-core-engine-map";
import { freezeAimiCoreOutput, type AimiCoreOutput } from "./aimi-core-output.interface";
import type { DiagnosticsOutput } from "../diagnostics/diagnostics-output.interface";
import type { LearningOutput } from "../learning/learning-output.interface";
import type { MultilingualOutput } from "../multilingual-nlp/multilingual-output.interface";
import type { PredictiveOutput } from "../predictive/predictive-output.interface";
import type { RoutingOutput } from "../routing/routing-output.interface";
import type { SchedulingOutput } from "../scheduling/scheduling-output.interface";
import type { SeverityOutput } from "../severity/severity-output.interface";
import type { VoiceOutput } from "../voice-nlp/voice-output.interface";
import type { DtoRole } from "../../core/dto/base.dto";

export type AimiCoreAggregation = {
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

export function aggregateAimiCore(parts: AimiCoreAggregation): AimiCoreOutput {
  return freezeAimiCoreOutput({
    event_id: parts.event_id,
    event_type: parts.event_type,
    engines_run: parts.engines_run,
    severity: parts.severity,
    routing: parts.routing,
    scheduling: parts.scheduling,
    predictive: parts.predictive,
    diagnostics: parts.diagnostics,
    learning: parts.learning,
    multilingual: parts.multilingual,
    voice: parts.voice,
    tenant_id: parts.tenant_id,
    user_id: parts.user_id,
    role: parts.role,
    timestamp: parts.timestamp,
  });
}
