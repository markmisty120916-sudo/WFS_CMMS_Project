/**
 * AIMI Routing Engine
 * Master Blueprint V2 / AIMI-ROUTING §8
 * Strict decision tree. First eligible candidate in list order. No fallback assignment.
 */

import type { RoutingInputs } from "./routing-inputs.interface";
import {
  isBayEligible,
  isSpeedEligible,
  isTechnicianEligible,
} from "./routing-rules";

export type RoutingMatch = {
  readonly technician_id: string;
  readonly bay_id: string;
  readonly reason: string;
};

export function evaluateRoutingTree(inputs: RoutingInputs): RoutingMatch | null {
  if (inputs.severity === "S5") {
    return {
      technician_id: "",
      bay_id: "",
      reason: "no routing required",
    };
  }

  let technician_id = "";
  let index = 0;
  while (index < inputs.technicians.length) {
    const technician = inputs.technicians[index];
    index = index + 1;
    if (isTechnicianEligible(
      technician,
      inputs.tenant_id,
      inputs.severity,
      inputs.workorder_is_pm,
      inputs.workorder_is_diagnostic,
    ) === false) {
      continue;
    }
    if (isSpeedEligible(technician.speed, inputs.severity) === false) {
      continue;
    }
    technician_id = technician.technician_id;
    break;
  }
  if (technician_id === "") {
    return null;
  }

  let bay_id = "";
  let bay_index = 0;
  while (bay_index < inputs.bays.length) {
    const bay = inputs.bays[bay_index];
    bay_index = bay_index + 1;
    if (isBayEligible(bay, inputs.tenant_id, inputs.severity) === false) {
      continue;
    }
    bay_id = bay.bay_id;
    break;
  }
  if (bay_id === "") {
    return null;
  }

  let reason = "any qualified technician";
  if (inputs.severity === "S1") {
    reason = "highest skill + fastest tech + specialized bay";
  }
  if (inputs.severity === "S2") {
    reason = "high skill + available tech";
  }
  if (inputs.severity === "S3") {
    reason = "medium skill + available tech";
  }

  return {
    technician_id,
    bay_id,
    reason,
  };
}
