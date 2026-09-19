/**
 * AIMI Learning Engine
 * Master Blueprint V2 / AIMI-LEARNING §7 / TECHNICIAN-WORKFLOW-SPEED §6
 * Strict update tree. Lowest workflow speed wins. No auto-apply.
 */

import type { LearningImpactArea, LearningInputs } from "./learning-inputs.interface";
import {
  actionForImpactArea,
  actionFromWorkflowSpeed,
  impactAreaForFleet,
  slowerWorkflowSpeed,
  speedFromCompletion,
  speedFromCompliance,
  speedFromPerformance,
  speedFromRepeat,
  speedFromValidation,
} from "./learning-rules";
import type { WorkflowSpeedLevel } from "./learning-inputs.interface";

export type LearningMatch = {
  readonly insight_summary: string;
  readonly recommended_action: string;
  readonly impact_area: LearningImpactArea;
};

function pickSlower(current: WorkflowSpeedLevel | null, candidate: WorkflowSpeedLevel | null): WorkflowSpeedLevel | null {
  if (candidate === null) {
    return current;
  }
  if (current === null) {
    return candidate;
  }
  return slowerWorkflowSpeed(current, candidate);
}

export function evaluateLearningUpdateTree(inputs: LearningInputs): LearningMatch | null {
  if (inputs.insight_type === "technician") {
    let speed: WorkflowSpeedLevel | null = speedFromPerformance(inputs.technician_performance);
    speed = pickSlower(speed, speedFromCompletion(inputs.diagnostic_completion));
    speed = pickSlower(speed, speedFromRepeat(inputs.repeat_repair));
    speed = pickSlower(speed, speedFromCompliance(inputs.step_compliance));
    speed = pickSlower(speed, speedFromValidation(inputs.telematics_validation));
    if (speed === null) {
      return null;
    }
    let summary = "high performance";
    if (speed === "MEDIUM") {
      summary = "average performance";
    }
    if (speed === "SLOW") {
      summary = "low performance";
    }
    if (inputs.pattern === "ineffective") {
      summary = "ineffective patterns";
    }
    if (inputs.pattern === "effective") {
      if (speed === "FAST") {
        summary = "effective patterns";
      }
    }
    return {
      insight_summary: summary,
      recommended_action: actionFromWorkflowSpeed(speed),
      impact_area: "workflow speed",
    };
  }

  if (inputs.insight_type === "fleet") {
    const area = impactAreaForFleet(inputs);
    if (area === null) {
      return null;
    }
    let summary = "common fault patterns";
    if (area === "PM") {
      summary = "common PM failures";
    }
    if (area === "predictive") {
      summary = "asset health trends";
      if (inputs.predictive_accuracy_trends === true) {
        summary = "predictive accuracy trends";
      }
    }
    if (area === "routing") {
      summary = "common compliance issues";
      if (inputs.common_repair_patterns === true) {
        summary = "common repair patterns";
      }
      if (inputs.common_fault_patterns === true) {
        summary = "common fault patterns";
      }
    }
    if (inputs.pattern === "ineffective") {
      summary = "ineffective patterns";
    }
    return {
      insight_summary: summary,
      recommended_action: actionForImpactArea(area),
      impact_area: area,
    };
  }

  if (inputs.asset_health_trends === true) {
    return {
      insight_summary: "asset health trends",
      recommended_action: actionForImpactArea("predictive"),
      impact_area: "predictive",
    };
  }
  if (inputs.predictive_accuracy_trends === true) {
    return {
      insight_summary: "predictive accuracy trends",
      recommended_action: actionForImpactArea("predictive"),
      impact_area: "predictive",
    };
  }
  if (inputs.common_pm_failures === true) {
    return {
      insight_summary: "common PM failures",
      recommended_action: actionForImpactArea("PM"),
      impact_area: "PM",
    };
  }
  return null;
}
