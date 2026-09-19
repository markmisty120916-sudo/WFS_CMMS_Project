/**
 * AIMI Severity Engine
 * Master Blueprint V2 / AIMI-SEVERITY §7 / EVENT-BUS-SPEC §9
 * EventBus accepts workorder.updated. Payload includes severity, reason, tenant_id, user_id, role, timestamp.
 */

import type { IncomingEvent } from "../../core/event-bus/event.interface";
import type { SeverityOutput } from "./severity-output.interface";

export function incomingEventFromSeverity(output: SeverityOutput): IncomingEvent {
  return {
    event_id: output.inputs.workorder_id + ":" + output.severity + ":" + output.timestamp,
    event_type: "workorder.updated",
    event_source: "severity-engine",
    event_payload: {
      workorder_id: output.inputs.workorder_id,
      severity: output.severity,
      asset_id: output.inputs.asset_id,
      reason: output.reason,
    },
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
    timestamp: output.timestamp,
  };
}
