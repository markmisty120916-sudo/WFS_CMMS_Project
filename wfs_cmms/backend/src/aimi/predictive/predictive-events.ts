/**
 * AIMI Predictive Engine
 * Master Blueprint V2 / AIMI-PREDICTIVE §9 / EVENT-BUS-SPEC §6
 * Emits aimi.predictive.generated. Payload includes predictive_score, failure_risk, reason.
 */

import type { IncomingEvent } from "../../core/event-bus/event.interface";
import type { PredictiveOutput } from "./predictive-output.interface";

export function incomingEventFromPredictiveGenerated(output: PredictiveOutput): IncomingEvent {
  return {
    event_id: output.predictive_inputs.asset_id + ":" + output.failure_risk + ":" + output.predictive_timestamp,
    event_type: "aimi.predictive.generated",
    event_source: "predictive-engine",
    event_payload: {
      predictive_score: output.predictive_score,
      failure_risk: output.failure_risk,
      reason: output.predictive_reason,
      asset_id: output.predictive_inputs.asset_id,
      workorder_id: output.predictive_inputs.workorder_id,
    },
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
    timestamp: output.predictive_timestamp,
  };
}

export function incomingEventFromPredictiveUpdated(output: PredictiveOutput): IncomingEvent {
  return {
    event_id: output.predictive_inputs.asset_id + ":" + output.failure_risk + ":updated:" + output.predictive_timestamp,
    event_type: "aimi.predictive.updated",
    event_source: "predictive-engine",
    event_payload: {
      predictive_score: output.predictive_score,
      failure_risk: output.failure_risk,
      reason: output.predictive_reason,
      asset_id: output.predictive_inputs.asset_id,
      workorder_id: output.predictive_inputs.workorder_id,
    },
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
    timestamp: output.predictive_timestamp,
  };
}

export function incomingEventFromPredictiveEscalated(output: PredictiveOutput): IncomingEvent {
  return {
    event_id: output.predictive_inputs.asset_id + ":" + output.failure_risk + ":escalated:" + output.predictive_timestamp,
    event_type: "aimi.predictive.escalated",
    event_source: "predictive-engine",
    event_payload: {
      predictive_score: output.predictive_score,
      failure_risk: output.failure_risk,
      reason: output.predictive_reason,
      asset_id: output.predictive_inputs.asset_id,
      workorder_id: output.predictive_inputs.workorder_id,
    },
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
    timestamp: output.predictive_timestamp,
  };
}
