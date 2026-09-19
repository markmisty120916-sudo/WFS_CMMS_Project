/**
 * AIMI Severity Engine
 * Master Blueprint V2 / AIMI-SEVERITY §5
 * Strict decision tree. Highest applicable level wins. No inferred symptoms.
 */

import type { SeverityInputs, SeverityMatch } from "./severity-inputs.interface";
import { isHigherSeverity, type SeverityLevel } from "./severity-levels";

function pick(current: SeverityMatch | null, candidate: SeverityMatch): SeverityMatch {
  if (current === null) {
    return candidate;
  }
  if (isHigherSeverity(candidate.level, current.level)) {
    return candidate;
  }
  return current;
}

export function evaluateSeverityTree(inputs: SeverityInputs): SeverityMatch | null {
  let match: SeverityMatch | null = null;

  if (inputs.safety_critical === true) {
    match = pick(match, {
      level: "S1",
      reason: "safety-critical failure",
    });
  }

  if (inputs.compliance === "blocks_operation") {
    match = pick(match, {
      level: "S1",
      reason: "compliance violation preventing operation",
    });
  }
  if (inputs.compliance === "requires_correction") {
    match = pick(match, {
      level: "S2",
      reason: "compliance violation requires correction",
    });
  }

  if (inputs.telematics === "critical") {
    match = pick(match, {
      level: "S1",
      reason: "critical telematics fault",
    });
  }
  if (inputs.telematics === "major") {
    match = pick(match, {
      level: "S2",
      reason: "major telematics fault",
    });
  }
  if (inputs.telematics === "moderate") {
    match = pick(match, {
      level: "S3",
      reason: "moderate telematics fault",
    });
  }
  if (inputs.telematics === "minor") {
    match = pick(match, {
      level: "S4",
      reason: "minor telematics fault",
    });
  }

  if (inputs.predictive === "imminent_failure") {
    match = pick(match, {
      level: "S1",
      reason: "predictive alert indicating imminent failure",
    });
  }
  if (inputs.predictive === "high_risk") {
    match = pick(match, {
      level: "S2",
      reason: "high-risk predictive alert",
    });
  }
  if (inputs.predictive === "moderate_risk") {
    match = pick(match, {
      level: "S3",
      reason: "moderate predictive risk",
    });
  }

  if (inputs.pm === "overdue_beyond_threshold") {
    match = pick(match, {
      level: "S2",
      reason: "PM overdue beyond threshold",
    });
  }
  if (inputs.pm === "upcoming") {
    match = pick(match, {
      level: "S3",
      reason: "PM upcoming",
    });
  }
  if (inputs.pm === "minor") {
    match = pick(match, {
      level: "S4",
      reason: "low-impact PM finding",
    });
  }

  if (inputs.technician_notes === "urgent") {
    match = pick(match, {
      level: "S2",
      reason: "technician identifies urgent condition",
    });
  }
  if (inputs.technician_notes === "moderate") {
    match = pick(match, {
      level: "S3",
      reason: "technician identifies moderate condition",
    });
  }
  if (inputs.technician_notes === "minor") {
    match = pick(match, {
      level: "S4",
      reason: "minor technician notes",
    });
  }
  if (inputs.technician_notes === "informational") {
    match = pick(match, {
      level: "S5",
      reason: "informational notes",
    });
  }

  if (inputs.driver_defects === "safety") {
    match = pick(match, {
      level: "S1",
      reason: "driver defect safety",
    });
  }
  if (inputs.driver_defects === "major") {
    match = pick(match, {
      level: "S2",
      reason: "driver defect major",
    });
  }
  if (inputs.driver_defects === "moderate") {
    match = pick(match, {
      level: "S3",
      reason: "driver defect moderate",
    });
  }
  if (inputs.driver_defects === "minor") {
    match = pick(match, {
      level: "S4",
      reason: "driver defect minor",
    });
  }
  if (inputs.driver_defects === "info") {
    match = pick(match, {
      level: "S5",
      reason: "minor driver comments",
    });
  }

  return match;
}

export type { SeverityLevel };
