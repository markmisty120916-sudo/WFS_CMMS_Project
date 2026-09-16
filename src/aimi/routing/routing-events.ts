/**
 * AIMI Routing Engine
 * Master Blueprint V2 / AIMI-ROUTING §10 / EVENT-BUS-SPEC §10
 * Emits routing.assigned. Payload includes technician_id, bay_id, reason.
 */

import type { IncomingEvent } from "../../core/event-bus/event.interface";
import type { RoutingOutput } from "./routing-output.interface";

export function incomingEventFromRouting(output: RoutingOutput): IncomingEvent {
  return {
    event_id: output.inputs.workorder_id + ":" + output.technician_id + ":" + output.routing_timestamp,
    event_type: "routing.assigned",
    event_source: "routing-engine",
    event_payload: {
      technician_id: output.technician_id,
      bay_id: output.bay_id,
      reason: output.routing_reason,
      severity: output.inputs.severity,
      workorder_id: output.inputs.workorder_id,
    },
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
    timestamp: output.routing_timestamp,
  };
}

export function incomingEventFromRoutingOverride(output: RoutingOutput): IncomingEvent {
  return {
    event_id: output.inputs.workorder_id + ":" + output.technician_id + ":override:" + output.routing_timestamp,
    event_type: "routing.overridden",
    event_source: "routing-engine",
    event_payload: {
      technician_id: output.technician_id,
      bay_id: output.bay_id,
      reason: output.routing_reason,
      severity: output.inputs.severity,
      workorder_id: output.inputs.workorder_id,
    },
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
    timestamp: output.routing_timestamp,
  };
}
