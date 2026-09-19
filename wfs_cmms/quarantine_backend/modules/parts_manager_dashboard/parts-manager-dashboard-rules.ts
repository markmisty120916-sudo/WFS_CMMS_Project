import type { DtoRole } from "../../../../src/core/dto/base.dto";
import type { ErrorType } from "../../../../src/core/errors/error-types";

export function canAccessPartsManagerDashboard(role: DtoRole): boolean {
  if (role === "PARTS MANAGER") {
    return true;
  }
  if (role === "FLEET MANAGER") {
    return true;
  }
  if (role === "MASTER TECHNICIAN") {
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

export function canMutatePartsManagerDashboard(role: DtoRole): boolean {
  if (role === "PARTS MANAGER") {
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

export function canUsePartsManagerLimitedActions(role: DtoRole): boolean {
  if (canMutatePartsManagerDashboard(role) === true) {
    return true;
  }
  if (role === "FLEET MANAGER") {
    return true;
  }
  return false;
}

export function partsManagerAccessError(role: DtoRole): ErrorType | "none" {
  if (canAccessPartsManagerDashboard(role) === false) {
    return "role unauthorized";
  }
  return "none";
}

export function stockStatusFromQuantity(quantity: string): string {
  const value = Number(quantity);
  if (Number.isFinite(value) === false) {
    return "ok";
  }
  if (value <= 0) {
    return "critical";
  }
  if (value <= 1) {
    return "reorder";
  }
  return "ok";
}
