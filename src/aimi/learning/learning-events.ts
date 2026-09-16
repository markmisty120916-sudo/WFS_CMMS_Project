/**
 * AIMI Learning Engine
 * Master Blueprint V2 / AIMI-LEARNING §9 / EVENT-BUS-SPEC §7
 * Emits aimi.learning.insight.generated. Payload includes insight_type and recommended_action.
 */

import type { IncomingEvent } from "../../core/event-bus/event.interface";
import type { LearningOutput } from "./learning-output.interface";

export function incomingEventFromLearningGenerated(output: LearningOutput): IncomingEvent {
  return {
    event_id: output.learning_insight_id + ":generated:" + output.learning_timestamp,
    event_type: "aimi.learning.insight.generated",
    event_source: "learning-engine",
    event_payload: {
      insight_type: output.insight_type,
      recommended_action: output.recommended_action,
      learning_inputs: {
        workorder_id: output.learning_inputs.workorder_id,
        asset_id: output.learning_inputs.asset_id,
        technician_id: output.learning_inputs.technician_id,
        insight_type: output.learning_inputs.insight_type,
      },
      learning_insight_id: output.learning_insight_id,
    },
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
    timestamp: output.learning_timestamp,
  };
}

export function incomingEventFromLearningApproved(output: LearningOutput): IncomingEvent {
  return {
    event_id: output.learning_insight_id + ":approved:" + output.learning_timestamp,
    event_type: "aimi.learning.insight.approved",
    event_source: "learning-engine",
    event_payload: {
      insight_type: output.insight_type,
      recommended_action: output.recommended_action,
      learning_inputs: {
        workorder_id: output.learning_inputs.workorder_id,
        asset_id: output.learning_inputs.asset_id,
        technician_id: output.learning_inputs.technician_id,
        insight_type: output.learning_inputs.insight_type,
      },
      learning_insight_id: output.learning_insight_id,
    },
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
    timestamp: output.learning_timestamp,
  };
}

export function incomingEventFromLearningApplied(output: LearningOutput): IncomingEvent {
  return {
    event_id: output.learning_insight_id + ":applied:" + output.learning_timestamp,
    event_type: "aimi.learning.insight.applied",
    event_source: "learning-engine",
    event_payload: {
      insight_type: output.insight_type,
      recommended_action: output.recommended_action,
      learning_inputs: {
        workorder_id: output.learning_inputs.workorder_id,
        asset_id: output.learning_inputs.asset_id,
        technician_id: output.learning_inputs.technician_id,
        insight_type: output.learning_inputs.insight_type,
      },
      learning_insight_id: output.learning_insight_id,
    },
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
    timestamp: output.learning_timestamp,
  };
}
