/**
 * AIMI Session Layer
 * Master Blueprint V2 / EVENT-BUS-SPEC
 * Session construction does not invent EventBus types.
 * Audit payload reuses the source whitelist event_type and is not republished.
 */

import type { IncomingEvent } from "../../core/event-bus/event.interface";
import type { AimiSession } from "./aimi-session.interface";

export function incomingEventFromAimiSession(session: AimiSession): IncomingEvent {
  return {
    event_id: session.context.event.event_id + ":aimi-session:" + session.timestamp,
    event_type: session.context.event.event_type,
    event_source: "aimi-session",
    event_payload: {
      session_id: session.session_id,
      previous_event_id: session.previous_event_id,
      source_event_id: session.context.event.event_id,
      event_type: session.context.event.event_type,
      engines_selected: session.engines_selected,
    },
    tenant_id: session.tenant_id,
    user_id: session.user_id,
    role: session.role,
    timestamp: session.timestamp,
  };
}
