/**
 * AIMI Core
 * Master Blueprint V2 / aimi.md §2 / TENANT-ISOLATION
 * Coded engine inputs only. Core does not invent engine payloads.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type { IntegrationEvent } from "../../core/event-bus/event.interface";
import type { LifecycleSnapshot } from "../../core/lifecycle-engine/lifecycle-snapshot";
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

export type AimiCoreContext = {
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
