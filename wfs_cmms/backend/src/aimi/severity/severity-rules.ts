/**
 * AIMI Severity Engine
 * Master Blueprint V2 / AIMI-SEVERITY §4 / §8
 * Role and override rules. Technician cannot override. Override cannot reduce S1.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type { SeverityLevel } from "./severity-levels";
import { isHigherSeverity } from "./severity-levels";

export function isRoleAllowedToClassify(role: DtoRole): boolean {
  if (role === "TECHNICIAN") {
    return true;
  }
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

export function isRoleAllowedToOverride(role: DtoRole): boolean {
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

export function doesOverrideReduceSafety(
  current: SeverityLevel,
  override: SeverityLevel,
): boolean {
  if (isHigherSeverity(current, override)) {
    return true;
  }
  return false;
}
