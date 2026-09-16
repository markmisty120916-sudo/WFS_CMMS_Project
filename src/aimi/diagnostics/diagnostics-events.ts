/**
 * AIMI Diagnostics Engine
 * Master Blueprint V2 / AIMI-DIAGNOSTIC-FLOWS §14 / EVENT-BUS-SPEC §12
 * Emits diagnostic.step.started. Payload includes step_id and diagnostic_flow_id.
 */

import type { IncomingEvent } from "../../core/event-bus/event.interface";
import type { DiagnosticsOutput } from "./diagnostics-output.interface";

export function incomingEventFromDiagnosticStepStarted(output: DiagnosticsOutput): IncomingEvent {
  return {
    event_id: output.diagnostic_flow_id + ":" + output.current_step_id + ":started:" + output.diagnostic_timestamp,
    event_type: "diagnostic.step.started",
    event_source: "diagnostics-engine",
    event_payload: {
      step_id: output.current_step_id,
      diagnostic_flow_id: output.diagnostic_flow_id,
      workorder_id: output.diagnostic_inputs.workorder_id,
      path: output.diagnostic_path,
    },
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
    timestamp: output.diagnostic_timestamp,
  };
}

export function incomingEventFromDiagnosticStepCompleted(output: DiagnosticsOutput, step_id: string): IncomingEvent {
  return {
    event_id: output.diagnostic_flow_id + ":" + step_id + ":completed:" + output.diagnostic_timestamp,
    event_type: "diagnostic.step.completed",
    event_source: "diagnostics-engine",
    event_payload: {
      step_id,
      diagnostic_flow_id: output.diagnostic_flow_id,
      workorder_id: output.diagnostic_inputs.workorder_id,
      path: output.diagnostic_path,
    },
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
    timestamp: output.diagnostic_timestamp,
  };
}

export function incomingEventFromDiagnosticStepSkipped(output: DiagnosticsOutput, step_id: string): IncomingEvent {
  return {
    event_id: output.diagnostic_flow_id + ":" + step_id + ":skipped:" + output.diagnostic_timestamp,
    event_type: "diagnostic.step.skipped",
    event_source: "diagnostics-engine",
    event_payload: {
      step_id,
      diagnostic_flow_id: output.diagnostic_flow_id,
      workorder_id: output.diagnostic_inputs.workorder_id,
      path: output.diagnostic_path,
    },
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
    timestamp: output.diagnostic_timestamp,
  };
}

export function incomingEventFromDiagnosticVerification(output: DiagnosticsOutput): IncomingEvent {
  return {
    event_id: output.diagnostic_flow_id + ":verification:" + output.diagnostic_timestamp,
    event_type: "diagnostic.verification.completed",
    event_source: "diagnostics-engine",
    event_payload: {
      step_id: output.current_step_id,
      diagnostic_flow_id: output.diagnostic_flow_id,
      workorder_id: output.diagnostic_inputs.workorder_id,
      path: output.diagnostic_path,
    },
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
    timestamp: output.diagnostic_timestamp,
  };
}
