/**
 * AIMI Context Layer
 * Master Blueprint V2 / aimi.md §2 / TENANT-ISOLATION
 * Immutable AIMI Core context. Layer does not invent engine payloads.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type { IntegrationEvent } from "../../core/event-bus/event.interface";
import type { LifecycleSnapshot } from "../../core/lifecycle-engine/lifecycle-snapshot";
import type { AimiCoreContext } from "../core/aimi-core-context.interface";
import type { AimiEngineName } from "../core/aimi-core-engine-map";
import type { DiagnosticInputs } from "../diagnostics/diagnostics-inputs.interface";
import type { DiagnosticsOutput } from "../diagnostics/diagnostics-output.interface";
import type { LearningInputs } from "../learning/learning-inputs.interface";
import type { LearningOutput } from "../learning/learning-output.interface";
import type { MultilingualInputs } from "../multilingual-nlp/multilingual-inputs.interface";
import type { MultilingualOutput } from "../multilingual-nlp/multilingual-output.interface";
import type { PredictiveInputs } from "../predictive/predictive-inputs.interface";
import type { PredictiveOutput } from "../predictive/predictive-output.interface";
import type { RoutingInputs } from "../routing/routing-inputs.interface";
import type { RoutingOutput } from "../routing/routing-output.interface";
import type { SchedulingInputs } from "../scheduling/scheduling-inputs.interface";
import type { SchedulingOutput } from "../scheduling/scheduling-output.interface";
import type { SeverityInputs } from "../severity/severity-inputs.interface";
import type { SeverityOutput } from "../severity/severity-output.interface";
import type { VoiceInputs } from "../voice-nlp/voice-inputs.interface";
import type { VoiceOutput } from "../voice-nlp/voice-output.interface";

export type AimiContext = AimiCoreContext;

export type AimiContextSource = {
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
  readonly timestamp: string;
  readonly event: IntegrationEvent;
  readonly workorder_snapshot: LifecycleSnapshot | null;
  readonly diagnostic_snapshot: LifecycleSnapshot | null;
  readonly pm_snapshot: LifecycleSnapshot | null;
  readonly severity_inputs: SeverityInputs | null;
  readonly routing_inputs: RoutingInputs | null;
  readonly scheduling_inputs: SchedulingInputs | null;
  readonly predictive_inputs: PredictiveInputs | null;
  readonly diagnostic_inputs: DiagnosticInputs | null;
  readonly learning_inputs: LearningInputs | null;
  readonly multilingual_inputs: MultilingualInputs | null;
  readonly voice_inputs: VoiceInputs | null;
  readonly prior_severity: SeverityOutput | null;
  readonly prior_routing: RoutingOutput | null;
  readonly prior_scheduling: SchedulingOutput | null;
  readonly prior_predictive: PredictiveOutput | null;
  readonly prior_diagnostics: DiagnosticsOutput | null;
  readonly prior_learning: LearningOutput | null;
  readonly prior_multilingual: MultilingualOutput | null;
  readonly prior_voice: VoiceOutput | null;
};

export type AimiContextBuild = {
  readonly context: AimiContext;
  readonly engines_selected: readonly AimiEngineName[];
};

export function freezeAimiContext(context: AimiContext): AimiContext {
  return Object.freeze({
    tenant_id: context.tenant_id,
    user_id: context.user_id,
    role: context.role,
    timestamp: context.timestamp,
    event: context.event,
    workorder_snapshot: context.workorder_snapshot,
    diagnostic_snapshot: context.diagnostic_snapshot,
    pm_snapshot: context.pm_snapshot,
    severity_inputs: context.severity_inputs,
    routing_inputs: context.routing_inputs,
    scheduling_inputs: context.scheduling_inputs,
    predictive_inputs: context.predictive_inputs,
    diagnostic_inputs: context.diagnostic_inputs,
    learning_inputs: context.learning_inputs,
    multilingual_inputs: context.multilingual_inputs,
    voice_inputs: context.voice_inputs,
    prior_severity: context.prior_severity,
    prior_routing: context.prior_routing,
    prior_scheduling: context.prior_scheduling,
    prior_predictive: context.prior_predictive,
    prior_diagnostics: context.prior_diagnostics,
    prior_learning: context.prior_learning,
    prior_multilingual: context.prior_multilingual,
    prior_voice: context.prior_voice,
  });
}
