/**
 * AIMI Learning Engine
 * Master Blueprint V2 / AIMI-LEARNING §5–§10 / TECHNICIAN-WORKFLOW-SPEED §6 / RBAC
 * Proposal rules only. Weights are never mutated. Technician cannot approve.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type {
  CompletionBand,
  ComplianceBand,
  LearningImpactArea,
  LearningInputs,
  LearningWeight,
  PerformanceBand,
  RepeatBand,
  ValidationBand,
  WorkflowSpeedLevel,
} from "./learning-inputs.interface";

export function isRoleAllowedToGenerateLearning(role: DtoRole): boolean {
  if (role === "MASTER TECHNICIAN") {
    return true;
  }
  if (role === "FLEET MANAGER") {
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

export function isRoleAllowedToApproveLearning(role: DtoRole): boolean {
  if (role === "MASTER TECHNICIAN") {
    return true;
  }
  if (role === "FLEET MANAGER") {
    return true;
  }
  if (role === "SILENT MASTER KEY") {
    return true;
  }
  return false;
}

export function workflowSpeedRank(speed: WorkflowSpeedLevel): number {
  if (speed === "FAST") {
    return 1;
  }
  if (speed === "MEDIUM") {
    return 2;
  }
  return 3;
}

export function slowerWorkflowSpeed(left: WorkflowSpeedLevel, right: WorkflowSpeedLevel): WorkflowSpeedLevel {
  if (workflowSpeedRank(left) >= workflowSpeedRank(right)) {
    return left;
  }
  return right;
}

export function speedFromPerformance(band: PerformanceBand): WorkflowSpeedLevel | null {
  if (band === "high") {
    return "FAST";
  }
  if (band === "average") {
    return "MEDIUM";
  }
  if (band === "low") {
    return "SLOW";
  }
  return null;
}

export function speedFromCompletion(band: CompletionBand): WorkflowSpeedLevel | null {
  if (band === "fast") {
    return "FAST";
  }
  if (band === "average") {
    return "MEDIUM";
  }
  if (band === "slow") {
    return "SLOW";
  }
  return null;
}

export function speedFromRepeat(band: RepeatBand): WorkflowSpeedLevel | null {
  if (band === "low") {
    return "FAST";
  }
  if (band === "moderate") {
    return "MEDIUM";
  }
  if (band === "high") {
    return "SLOW";
  }
  return null;
}

export function speedFromCompliance(band: ComplianceBand): WorkflowSpeedLevel | null {
  if (band === "high") {
    return "FAST";
  }
  if (band === "moderate") {
    return "MEDIUM";
  }
  if (band === "low") {
    return "SLOW";
  }
  return null;
}

export function speedFromValidation(band: ValidationBand): WorkflowSpeedLevel | null {
  if (band === "high") {
    return "FAST";
  }
  if (band === "moderate") {
    return "MEDIUM";
  }
  if (band === "low") {
    return "SLOW";
  }
  return null;
}

export function actionFromWorkflowSpeed(speed: WorkflowSpeedLevel): string {
  if (speed === "FAST") {
    return "propose FAST workflow speed";
  }
  if (speed === "MEDIUM") {
    return "propose MEDIUM workflow speed";
  }
  return "propose SLOW workflow speed";
}

export function areWeightsImmutable(current: readonly LearningWeight[], next: readonly LearningWeight[]): boolean {
  if (current.length !== next.length) {
    return false;
  }
  let index = 0;
  while (index < current.length) {
    if (current[index].weight_id !== next[index].weight_id) {
      return false;
    }
    if (current[index].tenant_id !== next[index].tenant_id) {
      return false;
    }
    if (current[index].key !== next[index].key) {
      return false;
    }
    if (current[index].value !== next[index].value) {
      return false;
    }
    index = index + 1;
  }
  return true;
}

export function weightsAreTenantScoped(weights: readonly LearningWeight[], tenant_id: string): boolean {
  let index = 0;
  while (index < weights.length) {
    if (weights[index].tenant_id !== tenant_id) {
      return false;
    }
    index = index + 1;
  }
  return true;
}

export function impactAreaForFleet(inputs: LearningInputs): LearningImpactArea | null {
  if (inputs.common_pm_failures === true) {
    return "PM";
  }
  if (inputs.predictive_accuracy_trends === true) {
    return "predictive";
  }
  if (inputs.asset_health_trends === true) {
    return "predictive";
  }
  if (inputs.common_fault_patterns === true) {
    return "routing";
  }
  if (inputs.common_repair_patterns === true) {
    return "routing";
  }
  if (inputs.common_compliance_issues === true) {
    return "routing";
  }
  return null;
}

export function actionForImpactArea(area: LearningImpactArea): string {
  if (area === "PM") {
    return "propose changes to PM templates";
  }
  if (area === "predictive") {
    return "propose changes to predictive thresholds";
  }
  if (area === "routing") {
    return "propose changes to routing preferences";
  }
  if (area === "scheduling") {
    return "propose changes to scheduling preferences";
  }
  return "propose MEDIUM workflow speed";
}
