import type { DtoRole } from "../../core/dto/base.dto";
import type { ErrorType } from "../../core/errors/error-types";

export function canCreateDriverDefect(role: DtoRole): boolean {
  if (role === "DRIVER") {
    return true;
  }
  if (role === "SILENT MASTER KEY") {
    return true;
  }
  return false;
}

export function canManageDriverDefect(role: DtoRole): boolean {
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

export function canReadDriverDefect(role: DtoRole): boolean {
  if (canCreateDriverDefect(role) === true) {
    return true;
  }
  if (canManageDriverDefect(role) === true) {
    return true;
  }
  return false;
}

export function canPublishDriverDefectEvent(role: DtoRole): boolean {
  if (role === "ADMIN") {
    return true;
  }
  if (role === "SILENT MASTER KEY") {
    return true;
  }
  return false;
}

export function isCodedDriverDefectSeverity(value: string): boolean {
  if (value === "safety") {
    return true;
  }
  if (value === "major") {
    return true;
  }
  if (value === "moderate") {
    return true;
  }
  if (value === "minor") {
    return true;
  }
  if (value === "info") {
    return true;
  }
  return false;
}

export function driverDefectTenantError(tenant_id: string, record_tenant_id: string): ErrorType | "none" {
  if (record_tenant_id !== tenant_id) {
    return "tenant_id mismatch";
  }
  return "none";
}

export function driverDefectCreateError(role: DtoRole): ErrorType | "none" {
  if (canCreateDriverDefect(role) === false) {
    return "role unauthorized";
  }
  return "none";
}

export function driverDefectManageError(role: DtoRole): ErrorType | "none" {
  if (canManageDriverDefect(role) === false) {
    return "role unauthorized";
  }
  return "none";
}

export function driverDefectReadError(role: DtoRole): ErrorType | "none" {
  if (canReadDriverDefect(role) === false) {
    return "role unauthorized";
  }
  return "none";
}
