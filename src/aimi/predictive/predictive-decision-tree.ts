/**
 * AIMI Predictive Engine
 * Master Blueprint V2 / AIMI-PREDICTIVE §7
 * Strict decision tree. Highest applicable level wins. No inferred failure.
 */

import type { FailureRisk, PredictiveInputs } from "./predictive-inputs.interface";
import { isHigherFailureRisk } from "./predictive-rules";

export type PredictiveMatch = {
  readonly failure_risk: FailureRisk;
  readonly reason: string;
};

function pick(current: PredictiveMatch | null, candidate: PredictiveMatch): PredictiveMatch {
  if (current === null) {
    return candidate;
  }
  if (isHigherFailureRisk(candidate.failure_risk, current.failure_risk)) {
    return candidate;
  }
  return current;
}

export function evaluatePredictiveTree(inputs: PredictiveInputs): PredictiveMatch | null {
  let match: PredictiveMatch | null = null;

  if (inputs.telematics_cluster === "critical") {
    match = pick(match, {
      failure_risk: "Imminent",
      reason: "critical telematics fault cluster",
    });
  }
  if (inputs.telematics_cluster === "major") {
    match = pick(match, {
      failure_risk: "High",
      reason: "major telematics fault cluster",
    });
  }
  if (inputs.telematics_cluster === "moderate") {
    match = pick(match, {
      failure_risk: "Medium",
      reason: "moderate telematics faults",
    });
  }
  if (inputs.telematics_cluster === "minor") {
    match = pick(match, {
      failure_risk: "Low",
      reason: "minor telematics faults",
    });
  }

  if (inputs.pm === "overdue") {
    match = pick(match, {
      failure_risk: "High",
      reason: "PM overdue beyond threshold",
    });
  }
  if (inputs.pm === "upcoming") {
    match = pick(match, {
      failure_risk: "Medium",
      reason: "PM upcoming",
    });
  }

  if (inputs.diagnostic === "repeated_failures") {
    match = pick(match, {
      failure_risk: "High",
      reason: "repeated failures",
    });
  }
  if (inputs.diagnostic === "slow_verification") {
    match = pick(match, {
      failure_risk: "Medium",
      reason: "slow verification",
    });
  }

  if (inputs.asset_health === "rapid_decline") {
    match = pick(match, {
      failure_risk: "Imminent",
      reason: "rapid health decline",
    });
  }
  if (inputs.asset_health === "moderate_decline") {
    match = pick(match, {
      failure_risk: "High",
      reason: "moderate decline",
    });
  }

  if (inputs.usage === "extreme") {
    match = pick(match, {
      failure_risk: "High",
      reason: "extreme usage",
    });
  }
  if (inputs.usage === "moderate") {
    match = pick(match, {
      failure_risk: "Medium",
      reason: "moderate usage",
    });
  }
  if (inputs.environmental === "extreme") {
    match = pick(match, {
      failure_risk: "High",
      reason: "extreme usage",
    });
  }
  if (inputs.environmental === "moderate") {
    match = pick(match, {
      failure_risk: "Medium",
      reason: "moderate usage",
    });
  }

  if (inputs.compliance_block === true) {
    match = pick(match, {
      failure_risk: "Imminent",
      reason: "compliance block preventing operation",
    });
  }
  if (inputs.repeated_s1_s2 === true) {
    match = pick(match, {
      failure_risk: "Imminent",
      reason: "repeated S1/S2 severity",
    });
  }
  if (inputs.repeated_s2 === true) {
    match = pick(match, {
      failure_risk: "High",
      reason: "repeated S2 severity",
    });
  }
  if (inputs.technician_notes === "moderate_concern") {
    match = pick(match, {
      failure_risk: "Medium",
      reason: "technician notes indicate moderate concern",
    });
  }

  return match;
}
