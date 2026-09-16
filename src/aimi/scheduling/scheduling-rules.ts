/**
 * AIMI Scheduling Engine
 * Master Blueprint V2 / AIMI-SCHEDULING §4–§9 / §13 / RBAC
 * Eligibility and override rules. Technician cannot run or override scheduling.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type { TechnicianSpeed } from "../routing/routing-inputs.interface";
import type { SeverityLevel } from "../severity/severity-levels";
import type {
  SchedulingBay,
  SchedulingInputs,
  SchedulingTechnician,
  SchedulingWindow,
  SchedulingWindowSlot,
} from "./scheduling-inputs.interface";

export function isRoleAllowedToSchedule(role: DtoRole): boolean {
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

export function isRoleAllowedToOverrideScheduling(role: DtoRole): boolean {
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

export function windowFromSeverity(severity: SeverityLevel): SchedulingWindow {
  if (severity === "S1") {
    return "Immediate Window";
  }
  if (severity === "S2") {
    return "Urgent Window";
  }
  if (severity === "S3") {
    return "Standard Window";
  }
  if (severity === "S4") {
    return "Deferred Window";
  }
  return "No Scheduling Required";
}

export function windowRank(window: SchedulingWindow): number {
  if (window === "Immediate Window") {
    return 1;
  }
  if (window === "Urgent Window") {
    return 2;
  }
  if (window === "Standard Window") {
    return 3;
  }
  if (window === "Deferred Window") {
    return 4;
  }
  return 5;
}

export function earlierWindow(left: SchedulingWindow, right: SchedulingWindow): SchedulingWindow {
  if (windowRank(left) <= windowRank(right)) {
    return left;
  }
  return right;
}

export function escalateWindow(window: SchedulingWindow): SchedulingWindow {
  if (window === "Urgent Window") {
    return "Immediate Window";
  }
  if (window === "Standard Window") {
    return "Urgent Window";
  }
  if (window === "Deferred Window") {
    return "Standard Window";
  }
  return window;
}

export function reasonFromSeverity(severity: SeverityLevel): string {
  if (severity === "S1") {
    return "must be scheduled immediately";
  }
  if (severity === "S2") {
    return "must be scheduled within short-term window";
  }
  if (severity === "S3") {
    return "must be scheduled within standard window";
  }
  if (severity === "S4") {
    return "may be scheduled in deferred window";
  }
  return "no scheduling required";
}

export function isTechnicianAvailable(technician: SchedulingTechnician, tenant_id: string): boolean {
  if (technician.tenant_id !== tenant_id) {
    return false;
  }
  if (technician.unavailable_shift === true) {
    return false;
  }
  if (technician.unavailable_pto === true) {
    return false;
  }
  if (technician.unavailable_training === true) {
    return false;
  }
  if (technician.over_workload_threshold === true) {
    return false;
  }
  return true;
}

export function isSchedulingSpeedEligible(speed: TechnicianSpeed, severity: SeverityLevel): boolean {
  if (severity === "S1") {
    if (speed === "Fast") {
      return true;
    }
    return false;
  }
  if (severity === "S2") {
    if (speed === "Fast") {
      return true;
    }
    if (speed === "Medium") {
      return true;
    }
    return false;
  }
  if (severity === "S3") {
    if (speed === "Medium") {
      return true;
    }
    if (speed === "Slow") {
      return true;
    }
    return false;
  }
  if (severity === "S4") {
    if (speed === "Slow") {
      return true;
    }
    if (speed === "Medium") {
      return true;
    }
    return false;
  }
  return false;
}

export function isTechnicianEligibleForScheduling(
  technician: SchedulingTechnician,
  tenant_id: string,
  severity: SeverityLevel,
  workorder_is_pm: boolean,
  workorder_is_diagnostic: boolean,
): boolean {
  if (isTechnicianAvailable(technician, tenant_id) === false) {
    return false;
  }
  if (isSchedulingSpeedEligible(technician.speed, severity) === false) {
    return false;
  }
  if (severity === "S1" || severity === "S2") {
    if (technician.highly_skilled === false) {
      return false;
    }
    if (technician.overloaded_s1_s2 === true) {
      return false;
    }
  }
  if (workorder_is_pm === true) {
    if (technician.overloaded_pm === true) {
      return false;
    }
  }
  if (workorder_is_diagnostic === true) {
    if (technician.overloaded_diagnostics === true) {
      return false;
    }
  }
  return true;
}

export function isBayEligibleForScheduling(
  bay: SchedulingBay,
  tenant_id: string,
  severity: SeverityLevel,
): boolean {
  if (bay.tenant_id !== tenant_id) {
    return false;
  }
  if (bay.compatible_asset_class === false) {
    return false;
  }
  if (bay.equipped === false) {
    return false;
  }
  if (bay.restricted === true) {
    return false;
  }
  if (bay.downtime === true) {
    return false;
  }
  if (severity === "S1") {
    if (bay.available_now === false) {
      return false;
    }
    if (bay.specialized === false) {
      return false;
    }
  }
  if (severity === "S2") {
    if (bay.available_soon === false) {
      if (bay.available_now === false) {
        return false;
      }
    }
  }
  if (severity === "S3") {
    if (bay.available === false) {
      return false;
    }
    if (bay.occupancy_blocked === true) {
      return false;
    }
  }
  if (severity === "S4") {
    if (bay.available === false) {
      if (bay.available_now === false) {
        if (bay.available_soon === false) {
          return false;
        }
      }
    }
  }
  return true;
}

export function isAssetEligibleForScheduling(inputs: SchedulingInputs): boolean {
  if (inputs.asset.tenant_id !== inputs.tenant_id) {
    return false;
  }
  if (inputs.asset.asset_id !== inputs.asset_id) {
    return false;
  }
  if (inputs.asset.restricted_operation === true) {
    return false;
  }
  if (inputs.asset.compliance_block === true) {
    return false;
  }
  return true;
}

export function findWindowSlot(
  slots: readonly SchedulingWindowSlot[],
  tenant_id: string,
  window: SchedulingWindow,
): SchedulingWindowSlot | null {
  let index = 0;
  while (index < slots.length) {
    const slot = slots[index];
    index = index + 1;
    if (slot.tenant_id !== tenant_id) {
      continue;
    }
    if (slot.window !== window) {
      continue;
    }
    return slot;
  }
  return null;
}

export function findWindowSlotByBounds(
  slots: readonly SchedulingWindowSlot[],
  tenant_id: string,
  scheduled_start: string,
  scheduled_end: string,
): SchedulingWindowSlot | null {
  let index = 0;
  while (index < slots.length) {
    const slot = slots[index];
    index = index + 1;
    if (slot.tenant_id !== tenant_id) {
      continue;
    }
    if (slot.scheduled_start !== scheduled_start) {
      continue;
    }
    if (slot.scheduled_end !== scheduled_end) {
      continue;
    }
    return slot;
  }
  return null;
}

export function doesSchedulingOverrideReduceSafety(
  inputs: SchedulingInputs,
  required_window: SchedulingWindow,
  slot: SchedulingWindowSlot,
  technician: SchedulingTechnician,
  bay: SchedulingBay,
): boolean {
  if (windowRank(slot.window) > windowRank(required_window)) {
    return true;
  }
  if (inputs.severity === "S5") {
    return false;
  }
  if (isTechnicianEligibleForScheduling(
    technician,
    inputs.tenant_id,
    inputs.severity,
    inputs.workorder_is_pm,
    inputs.workorder_is_diagnostic,
  ) === false) {
    return true;
  }
  if (isBayEligibleForScheduling(bay, inputs.tenant_id, inputs.severity) === false) {
    return true;
  }
  if (isAssetEligibleForScheduling(inputs) === false) {
    return true;
  }
  return false;
}
