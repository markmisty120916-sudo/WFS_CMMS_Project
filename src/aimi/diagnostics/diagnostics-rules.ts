/**
 * AIMI Diagnostics Engine
 * Master Blueprint V2 / AIMI-DIAGNOSTIC-FLOWS §7–§12 / RBAC
 * Path eligibility and skip rules. Safety steps cannot be skipped.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type {
  DiagnosticFlow,
  DiagnosticInputs,
  DiagnosticPathType,
  DiagnosticStep,
} from "./diagnostics-inputs.interface";

export function isRoleAllowedToDiagnose(role: DtoRole): boolean {
  if (role === "TECHNICIAN") {
    return true;
  }
  if (role === "MASTER TECHNICIAN") {
    return true;
  }
  if (role === "ADMIN") {
    return true;
  }
  if (role === "SILENT MASTER KEY") {
    return true;
  }
  return false;
}

export function countSymptomSources(inputs: DiagnosticInputs): number {
  let count = 0;
  if (inputs.telematics_fault === true) {
    count = count + 1;
  }
  if (inputs.driver_defect === true) {
    count = count + 1;
  }
  if (inputs.pm_finding === true) {
    count = count + 1;
  }
  if (inputs.technician_note === true) {
    count = count + 1;
  }
  if (inputs.predictive_alert === true) {
    count = count + 1;
  }
  return count;
}

export function pathFromSymptoms(inputs: DiagnosticInputs): DiagnosticPathType | null {
  if (countSymptomSources(inputs) >= 2) {
    return "Hybrid Path";
  }
  if (inputs.telematics_fault === true) {
    return "Telematics-Driven Path";
  }
  if (inputs.driver_defect === true) {
    return "Driver-Defect Path";
  }
  if (inputs.pm_finding === true) {
    return "PM-Finding Path";
  }
  if (inputs.technician_note === true) {
    return "Technician-Reported Path";
  }
  if (inputs.predictive_alert === true) {
    return "Predictive-Alert Path";
  }
  return null;
}

export function reasonFromPath(path: DiagnosticPathType): string {
  if (path === "Telematics-Driven Path") {
    return "telematics-driven path";
  }
  if (path === "Driver-Defect Path") {
    return "driver-defect path";
  }
  if (path === "PM-Finding Path") {
    return "PM-finding path";
  }
  if (path === "Technician-Reported Path") {
    return "technician-reported path";
  }
  if (path === "Predictive-Alert Path") {
    return "predictive-alert path";
  }
  return "hybrid path";
}

export function isStepEligible(step: DiagnosticStep, inputs: DiagnosticInputs, path: DiagnosticPathType): boolean {
  if (step.tenant_id !== inputs.tenant_id) {
    return false;
  }
  if (step.path !== path) {
    return false;
  }
  if (inputs.certified_diagnostic_flow === false) {
    return false;
  }
  if (step.asset_type_match === false) {
    return false;
  }
  if (step.technician_skill_match === false) {
    return false;
  }
  if (step.technician_speed_match === false) {
    return false;
  }
  if (step.shop_pattern_match === false) {
    return false;
  }
  if (step.fleet_pattern_match === false) {
    return false;
  }
  if (inputs.predictive_urgency === true) {
    if (step.predictive_urgency_match === false) {
      return false;
    }
  }
  return true;
}

export function findFlow(
  flows: readonly DiagnosticFlow[],
  diagnostic_flow_id: string,
  tenant_id: string,
  path: DiagnosticPathType,
): DiagnosticFlow | null {
  let index = 0;
  while (index < flows.length) {
    const flow = flows[index];
    index = index + 1;
    if (flow.tenant_id !== tenant_id) {
      continue;
    }
    if (flow.diagnostic_flow_id !== diagnostic_flow_id) {
      continue;
    }
    if (flow.path !== path) {
      continue;
    }
    return flow;
  }
  return null;
}

export function findStep(steps: readonly DiagnosticStep[], step_id: string): DiagnosticStep | null {
  let index = 0;
  while (index < steps.length) {
    if (steps[index].step_id === step_id) {
      return steps[index];
    }
    index = index + 1;
  }
  return null;
}

export function isStepRecorded(ids: readonly string[], step_id: string): boolean {
  let index = 0;
  while (index < ids.length) {
    if (ids[index] === step_id) {
      return true;
    }
    index = index + 1;
  }
  return false;
}

export function nextPendingStep(output_steps: readonly DiagnosticStep[], taken: readonly string[], skipped: readonly string[]): DiagnosticStep | null {
  let index = 0;
  while (index < output_steps.length) {
    const step = output_steps[index];
    index = index + 1;
    if (isStepRecorded(taken, step.step_id) === true) {
      continue;
    }
    if (isStepRecorded(skipped, step.step_id) === true) {
      continue;
    }
    return step;
  }
  return null;
}

export function canSkipStep(step: DiagnosticStep): boolean {
  if (step.safety_required === true) {
    return false;
  }
  return true;
}

export function requiredStepsComplete(output_steps: readonly DiagnosticStep[], taken: readonly string[]): boolean {
  let index = 0;
  while (index < output_steps.length) {
    const step = output_steps[index];
    index = index + 1;
    if (step.safety_required === true) {
      if (isStepRecorded(taken, step.step_id) === false) {
        return false;
      }
    }
  }
  return true;
}
