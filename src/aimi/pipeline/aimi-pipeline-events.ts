/**
 * AIMI Deterministic Pipeline
 * Master Blueprint V2 / EVENT-BUS-SPEC
 * Pipeline construction does not invent EventBus types.
 * Audit payload reuses the source whitelist event_type and is not republished.
 */

import type { IncomingEvent } from "../../core/event-bus/event.interface";
import type { AimiPipeline } from "./aimi-pipeline.interface";

export function incomingEventFromAimiPipeline(pipeline: AimiPipeline): IncomingEvent {
  return {
    event_id: pipeline.session.context.event.event_id + ":aimi-pipeline:" + pipeline.session.timestamp,
    event_type: pipeline.session.context.event.event_type,
    event_source: "aimi-pipeline",
    event_payload: {
      session_id: pipeline.session.session_id,
      source_event_id: pipeline.session.context.event.event_id,
      event_type: pipeline.session.context.event.event_type,
      engines_ordered: pipeline.engines_ordered,
      engines_run: pipeline.output.engines_run,
    },
    tenant_id: pipeline.session.tenant_id,
    user_id: pipeline.session.user_id,
    role: pipeline.session.role,
    timestamp: pipeline.session.timestamp,
  };
}
