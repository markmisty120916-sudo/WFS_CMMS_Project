/**
 * AIMI Output Normalizer
 * Master Blueprint V2 / EVENT-BUS-SPEC
 * Normalization does not invent EventBus types.
 * Audit payload reuses the source whitelist event_type and is not republished.
 */

import type { IncomingEvent } from "../../core/event-bus/event.interface";
import type { AimiNormalizedOutput } from "./aimi-output-normalizer.interface";

export function incomingEventFromAimiNormalizedOutput(
  envelope: AimiNormalizedOutput,
): IncomingEvent {
  return {
    event_id: envelope.event_id + ":aimi-output-normalizer:" + envelope.timestamp,
    event_type: envelope.event_type,
    event_source: "aimi-output-normalizer",
    event_payload: {
      session_id: envelope.session_id,
      source_event_id: envelope.event_id,
      event_type: envelope.event_type,
      engines_ordered: envelope.engines_ordered,
      engines_run: envelope.engines_run,
      insight_type: envelope.insight_type,
      insight_severity: envelope.insight_severity,
      impact_area: envelope.impact_area,
    },
    tenant_id: envelope.tenant_id,
    user_id: envelope.user_id,
    role: envelope.role,
    timestamp: envelope.timestamp,
  };
}
