import type { DtoRole } from "../../../../src/core/dto/base.dto";
import type { ErrorType } from "../../../../src/core/errors/error-types";

export function canAccessComplianceDashboard(role: DtoRole): boolean {
  if (role === "COMPLIANCE OFFICER") {
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
  if (role === "DRIVER") {
    return true;
  }
  return false;
}

export function canMutateComplianceDashboard(role: DtoRole): boolean {
  if (role === "COMPLIANCE OFFICER") {
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

export function canUseComplianceLimitedActions(role: DtoRole): boolean {
  if (canMutateComplianceDashboard(role) === true) {
    return true;
  }
  if (role === "MASTER TECHNICIAN") {
    return true;
  }
  return false;
}

export function canAccessComplianceDvirOnly(role: DtoRole): boolean {
  if (role === "DRIVER") {
    return true;
  }
  return false;
}

export function complianceDashboardAccessError(role: DtoRole): ErrorType | "none" {
  if (canAccessComplianceDashboard(role) === false) {
    return "role unauthorized";
  }
  return "none";
}

export function matchesComplianceCategory(type: string, compliance_category: string): boolean {
  if (compliance_category === "") {
    return true;
  }
  if (compliance_category === type) {
    return true;
  }
  if (compliance_category === "district" && type === "school_district") {
    return true;
  }
  return false;
}
