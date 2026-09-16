/**
 * AIMI Context Layer
 * Master Blueprint V2 / EVENT-BUS-SPEC
 * Context construction does not invent EventBus types.
 * Audit payload reuses the source whitelist event_type and is not republished.
 */

import type { IncomingEvent } from "../../core/event-bus/event.interface";
import type { AimiEngineName } from "../core/aimi-core-engine-map";
import type { AimiContext } from "./aimi-context.interface";

export function incomingEventFromAimiContext(
  context: AimiContext,
  engines_selected: readonly AimiEngineName[],
): IncomingEvent {
  return {
    event_id: context.event.event_id + ":aimi-context:" + context.timestamp,
    event_type: context.event.event_type,
    event_source: "aimi-context",
    event_payload: {
      source_event_id: context.event.event_id,
      event_type: context.event.event_type,
      engines_selected,
    },
    tenant_id: context.tenant_id,
    user_id: context.user_id,
    role: context.role,
    timestamp: context.timestamp,
  };
}
