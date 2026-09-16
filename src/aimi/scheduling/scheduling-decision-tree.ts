/**
 * AIMI Scheduling Engine
 * Master Blueprint V2 / AIMI-SCHEDULING §10
 * Strict decision tree. Earliest valid window. No guessed start or end.
 */

import type { SchedulingInputs, SchedulingWindow } from "./scheduling-inputs.interface";
import {
  earlierWindow,
  escalateWindow,
  findWindowSlot,
  isAssetEligibleForScheduling,
  isBayEligibleForScheduling,
  isTechnicianEligibleForScheduling,
  reasonFromSeverity,
  windowFromSeverity,
} from "./scheduling-rules";

export type SchedulingMatch = {
  readonly scheduled_start: string;
  readonly scheduled_end: string;
  readonly technician_id: string;
  readonly bay_id: string;
  readonly window: SchedulingWindow;
  readonly reason: string;
};

function findTechnician(
  inputs: SchedulingInputs,
  technician_id: string,
): SchedulingInputs["technicians"][number] | null {
  let index = 0;
  while (index < inputs.technicians.length) {
    if (inputs.technicians[index].technician_id === technician_id) {
      return inputs.technicians[index];
    }
    index = index + 1;
  }
  return null;
}

function findBay(inputs: SchedulingInputs, bay_id: string): SchedulingInputs["bays"][number] | null {
  let index = 0;
  while (index < inputs.bays.length) {
    if (inputs.bays[index].bay_id === bay_id) {
      return inputs.bays[index];
    }
    index = index + 1;
  }
  return null;
}

export function evaluateSchedulingTree(inputs: SchedulingInputs): SchedulingMatch | null {
  if (inputs.severity === "S5") {
    return {
      scheduled_start: "",
      scheduled_end: "",
      technician_id: "",
      bay_id: "",
      window: "No Scheduling Required",
      reason: "no scheduling required",
    };
  }

  if (isAssetEligibleForScheduling(inputs) === false) {
    return null;
  }

  const technician = findTechnician(inputs, inputs.routed_technician_id);
  const bay = findBay(inputs, inputs.routed_bay_id);
  if (technician === null || bay === null) {
    return null;
  }
  if (isTechnicianEligibleForScheduling(
    technician,
    inputs.tenant_id,
    inputs.severity,
    inputs.workorder_is_pm,
    inputs.workorder_is_diagnostic,
  ) === false) {
    return null;
  }
  if (isBayEligibleForScheduling(bay, inputs.tenant_id, inputs.severity) === false) {
    return null;
  }

  let window = windowFromSeverity(inputs.severity);
  let reason = reasonFromSeverity(inputs.severity);

  if (inputs.predictive === "imminent_failure") {
    window = earlierWindow(window, "Immediate Window");
    reason = "imminent failure";
  }
  if (inputs.predictive === "high_risk") {
    window = earlierWindow(window, "Urgent Window");
    if (reason !== "imminent failure") {
      reason = "high risk";
    }
  }

  if (inputs.pm === "overdue") {
    const escalated = escalateWindow(window);
    if (escalated !== window) {
      window = escalated;
      if (reason !== "imminent failure") {
        if (reason !== "high risk") {
          reason = "PM overdue";
        }
      }
    }
  }

  if (inputs.compliance_violation === true) {
    window = earlierWindow(window, escalateWindow(window));
    reason = "compliance violation";
  }

  if (inputs.pm === "upcoming") {
    if (reason === reasonFromSeverity(inputs.severity)) {
      if (inputs.severity === "S3") {
        reason = "PM windows must be aligned";
      }
    }
  }

  const slot = findWindowSlot(inputs.windows, inputs.tenant_id, window);
  if (slot === null) {
    return null;
  }

  return {
    scheduled_start: slot.scheduled_start,
    scheduled_end: slot.scheduled_end,
    technician_id: technician.technician_id,
    bay_id: bay.bay_id,
    window: slot.window,
    reason,
  };
}
