import type { DtoRole } from "../../core/dto/base.dto";
import type { ErrorType } from "../../core/errors/error-types";

export function canWriteCompliance(role: DtoRole): boolean {
  if (role === "COMPLIANCE OFFICER") {
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

export function canSubmitDriverReport(role: DtoRole): boolean {
  if (role === "DRIVER") {
    return true;
  }
  if (canWriteCompliance(role) === true) {
    return true;
  }
  return false;
}

export function canPublishComplianceEvent(role: DtoRole): boolean {
  if (role === "COMPLIANCE OFFICER") {
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

export function complianceTenantError(
  tenant_id: string,
  record_tenant_id: string,
): ErrorType | "none" {
  if (record_tenant_id !== tenant_id) {
    return "tenant_id mismatch";
  }
  return "none";
}

export function complianceWriteError(role: DtoRole): ErrorType | "none" {
  if (canWriteCompliance(role) === false) {
    return "role unauthorized";
  }
  return "none";
}

export function driverReportError(role: DtoRole): ErrorType | "none" {
  if (canSubmitDriverReport(role) === false) {
    return "role unauthorized";
  }
  return "none";
}

export function inspectionCompletedImmutableError(status: string): ErrorType | "none" {
  if (status === "passed") {
    return "lifecycle transition invalid";
  }
  if (status === "failed") {
    return "lifecycle transition invalid";
  }
  return "none";
}

export function isInspectionType(value: string): boolean {
  if (value === "DOT") {
    return true;
  }
  if (value === "school_district") {
    return true;
  }
  if (value === "custom") {
    return true;
  }
  return false;
}
