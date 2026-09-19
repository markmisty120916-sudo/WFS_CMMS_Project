/**
 * AIMI Scheduling Engine
 * Master Blueprint V2 / AIMI-SCHEDULING §12 / EVENT-BUS-SPEC §11
 * Emits scheduling.created. Payload includes scheduled_start, scheduled_end, reason.
 */

import type { IncomingEvent } from "../../core/event-bus/event.interface";
import type { SchedulingOutput } from "./scheduling-output.interface";

export function incomingEventFromScheduling(output: SchedulingOutput): IncomingEvent {
  return {
    event_id: output.scheduling_inputs.workorder_id + ":" + output.scheduled_start + ":" + output.scheduling_timestamp,
    event_type: "scheduling.created",
    event_source: "scheduling-engine",
    event_payload: {
      scheduled_start: output.scheduled_start,
      scheduled_end: output.scheduled_end,
      technician_id: output.technician_id,
      bay_id: output.bay_id,
      severity: output.scheduling_inputs.severity,
      reason: output.scheduling_reason,
      workorder_id: output.scheduling_inputs.workorder_id,
    },
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
    timestamp: output.scheduling_timestamp,
  };
}

export function incomingEventFromSchedulingOverride(output: SchedulingOutput): IncomingEvent {
  return {
    event_id: output.scheduling_inputs.workorder_id + ":" + output.scheduled_start + ":override:" + output.scheduling_timestamp,
    event_type: "scheduling.updated",
    event_source: "scheduling-engine",
    event_payload: {
      scheduled_start: output.scheduled_start,
      scheduled_end: output.scheduled_end,
      technician_id: output.technician_id,
      bay_id: output.bay_id,
      severity: output.scheduling_inputs.severity,
      reason: output.scheduling_reason,
      workorder_id: output.scheduling_inputs.workorder_id,
    },
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
    timestamp: output.scheduling_timestamp,
  };
}
