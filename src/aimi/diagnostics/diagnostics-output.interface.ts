/**
 * AIMI Diagnostics Engine
 * Master Blueprint V2 / AIMI-DIAGNOSTIC-FLOWS §4 / diagnostics.md §5
 * Immutable diagnostic output. Steps are frozen. Repairs are catalog ids only.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type {
  DiagnosticInputs,
  DiagnosticPathType,
  DiagnosticStep,
} from "./diagnostics-inputs.interface";

export type DiagnosticsOutput = {
  readonly diagnostic_flow_id: string;
  readonly diagnostic_path: DiagnosticPathType;
  readonly recommended_repair_id: string;
  readonly recommended_part_id: string;
  readonly recommended_labor_id: string;
  readonly steps: readonly DiagnosticStep[];
  readonly steps_taken: readonly string[];
  readonly steps_skipped: readonly string[];
  readonly current_step_id: string;
  readonly verification_complete: boolean;
  readonly diagnostic_reason: string;
  readonly diagnostic_inputs: DiagnosticInputs;
  readonly diagnostic_timestamp: string;
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
};

function freezeStep(step: DiagnosticStep): DiagnosticStep {
  return Object.freeze({
    step_id: step.step_id,
    diagnostic_flow_id: step.diagnostic_flow_id,
    tenant_id: step.tenant_id,
    path: step.path,
    safety_required: step.safety_required,
    asset_type_match: step.asset_type_match,
    technician_skill_match: step.technician_skill_match,
    technician_speed_match: step.technician_speed_match,
    shop_pattern_match: step.shop_pattern_match,
    fleet_pattern_match: step.fleet_pattern_match,
    predictive_urgency_match: step.predictive_urgency_match,
  });
}

export function freezeDiagnosticsOutput(output: DiagnosticsOutput): DiagnosticsOutput {
  const steps: DiagnosticStep[] = [];
  let index = 0;
  while (index < output.steps.length) {
    steps.push(freezeStep(output.steps[index]));
    index = index + 1;
  }
  const taken: string[] = [];
  let taken_index = 0;
  while (taken_index < output.steps_taken.length) {
    taken.push(output.steps_taken[taken_index]);
    taken_index = taken_index + 1;
  }
  const skipped: string[] = [];
  let skipped_index = 0;
  while (skipped_index < output.steps_skipped.length) {
    skipped.push(output.steps_skipped[skipped_index]);
    skipped_index = skipped_index + 1;
  }
  return Object.freeze({
    diagnostic_flow_id: output.diagnostic_flow_id,
    diagnostic_path: output.diagnostic_path,
    recommended_repair_id: output.recommended_repair_id,
    recommended_part_id: output.recommended_part_id,
    recommended_labor_id: output.recommended_labor_id,
    steps: Object.freeze(steps),
    steps_taken: Object.freeze(taken),
    steps_skipped: Object.freeze(skipped),
    current_step_id: output.current_step_id,
    verification_complete: output.verification_complete,
    diagnostic_reason: output.diagnostic_reason,
    diagnostic_inputs: output.diagnostic_inputs,
    diagnostic_timestamp: output.diagnostic_timestamp,
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
  });
}
