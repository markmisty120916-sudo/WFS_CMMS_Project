/**
 * AIMI Routing Engine
 * Master Blueprint V2 / AIMI-ROUTING §4–§8 / §11 / RBAC
 * Eligibility and override rules. Technician cannot run or override routing.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type { SeverityLevel } from "../severity/severity-levels";
import type { BayCandidate, RoutingInputs, TechnicianCandidate } from "./routing-inputs.interface";

export function isRoleAllowedToRoute(role: DtoRole): boolean {
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

export function isRoleAllowedToOverrideRouting(role: DtoRole): boolean {
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

export function isTechnicianEligible(
  technician: TechnicianCandidate,
  tenant_id: string,
  severity: SeverityLevel,
  workorder_is_pm: boolean,
  workorder_is_diagnostic: boolean,
): boolean {
  if (technician.tenant_id !== tenant_id) {
    return false;
  }
  if (technician.certified_asset_class === false) {
    return false;
  }
  if (technician.certified_repair_type === false) {
    return false;
  }
  if (technician.certified_diagnostic_flow === false) {
    return false;
  }
  if (technician.blocked_by_compliance === true) {
    return false;
  }
  if (technician.blocked_by_scheduling === true) {
    return false;
  }
  if (technician.over_workload_threshold === true) {
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
  if (severity === "S1" || severity === "S2") {
    if (technician.assigned_to_s1_s2 === true) {
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

export function isSpeedEligible(speed: TechnicianCandidate["speed"], severity: SeverityLevel): boolean {
  if (severity === "S1" || severity === "S2") {
    if (speed === "Fast") {
      return true;
    }
    return false;
  }
  if (severity === "S3") {
    if (speed === "Medium") {
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

export function isBayEligible(
  bay: BayCandidate,
  tenant_id: string,
  severity: SeverityLevel,
): boolean {
  if (bay.tenant_id !== tenant_id) {
    return false;
  }
  if (bay.available === false) {
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
  if (severity === "S1") {
    if (bay.specialized === false) {
      return false;
    }
  }
  return true;
}

export function doesRoutingOverrideReduceSafety(
  inputs: RoutingInputs,
  technician: TechnicianCandidate,
  bay: BayCandidate,
): boolean {
  if (isTechnicianEligible(
    technician,
    inputs.tenant_id,
    inputs.severity,
    inputs.workorder_is_pm,
    inputs.workorder_is_diagnostic,
  ) === false) {
    return true;
  }
  if (isSpeedEligible(technician.speed, inputs.severity) === false) {
    return true;
  }
  if (isBayEligible(bay, inputs.tenant_id, inputs.severity) === false) {
    return true;
  }
  return false;
}
