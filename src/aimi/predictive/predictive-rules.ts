/**
 * AIMI Predictive Engine
 * Master Blueprint V2 / AIMI-PREDICTIVE §4–§6 / §10 / RBAC
 * Role, risk rank, and closed score bands. No probability. Technician cannot override.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type { FailureRisk } from "./predictive-inputs.interface";

export function isRoleAllowedToForecast(role: DtoRole): boolean {
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

export function isRoleAllowedToOverridePredictive(role: DtoRole): boolean {
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

export function failureRiskRank(risk: FailureRisk): number {
  if (risk === "Imminent") {
    return 1;
  }
  if (risk === "High") {
    return 2;
  }
  if (risk === "Medium") {
    return 3;
  }
  return 4;
}

export function isHigherFailureRisk(candidate: FailureRisk, current: FailureRisk): boolean {
  if (failureRiskRank(candidate) < failureRiskRank(current)) {
    return true;
  }
  return false;
}

export function scoreForFailureRisk(risk: FailureRisk): number {
  if (risk === "Imminent") {
    return 91;
  }
  if (risk === "High") {
    return 76;
  }
  if (risk === "Medium") {
    return 51;
  }
  return 50;
}

export function doesPredictiveOverrideReduceSafety(
  current: FailureRisk,
  override: FailureRisk,
): boolean {
  if (isHigherFailureRisk(current, override)) {
    return true;
  }
  return false;
}
