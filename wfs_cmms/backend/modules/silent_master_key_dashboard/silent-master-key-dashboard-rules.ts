import type { DtoRole } from "../../../../src/core/dto/base.dto";
import type { ErrorType } from "../../../../src/core/errors/error-types";

export function canAccessSilentMasterKeyDashboard(role: DtoRole): boolean {
  if (role === "SILENT MASTER KEY") {
    return true;
  }
  return false;
}

export function canMutateSilentMasterKeyDashboard(role: DtoRole): boolean {
  if (role === "SILENT MASTER KEY") {
    return true;
  }
  return false;
}

export function silentMasterKeyAccessError(role: DtoRole): ErrorType | "none" {
  if (canAccessSilentMasterKeyDashboard(role) === false) {
    return "role unauthorized";
  }
  return "none";
}

export function silentMasterKeyMutateError(role: DtoRole): ErrorType | "none" {
  if (canMutateSilentMasterKeyDashboard(role) === false) {
    return "role unauthorized";
  }
  return "none";
}

export function severitySafetyRank(severity: string): number {
  if (severity === "S1") {
    return 1;
  }
  if (severity === "S2") {
    return 2;
  }
  if (severity === "S3") {
    return 3;
  }
  if (severity === "S4") {
    return 4;
  }
  if (severity === "S5") {
    return 5;
  }
  return 99;
}

export function severityOverrideReducesSafety(current: string, next: string): boolean {
  if (next === "") {
    return true;
  }
  const current_rank = severitySafetyRank(current);
  const next_rank = severitySafetyRank(next);
  if (next_rank > current_rank) {
    return true;
  }
  return false;
}
