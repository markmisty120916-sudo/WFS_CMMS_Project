/**
 * AIMI Core
 * Master Blueprint V2 / aimi.md §12 / EVENT-BUS-SPEC §8
 * Emits aimi.insight.generated after aggregation.
 */

import type { IncomingEvent } from "../../core/event-bus/event.interface";
import type { AimiCoreOutput } from "./aimi-core-output.interface";

export function incomingEventFromAimiCore(
  output: AimiCoreOutput,
  insight_type: "technician" | "fleet" | "asset",
  insight_severity: "Low" | "Medium" | "High" | "Critical",
  impact_area: string,
): IncomingEvent {
  return {
    event_id: output.event_id + ":aimi-core:" + output.timestamp,
    event_type: "aimi.insight.generated",
    event_source: "aimi-core",
    event_payload: {
      insight_type,
      insight_severity,
      impact_area,
      event_type: output.event_type,
      engines_run: output.engines_run,
    },
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
    timestamp: output.timestamp,
  };
}
