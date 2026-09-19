import type { DtoRole } from "@/dto/base.dto";
import type { ErrorType } from "@/errors/error-types";

export function canAccessFleetManagerDashboard(role: DtoRole): boolean {
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

export function canMutateFleetManagerDashboard(role: DtoRole): boolean {
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

export function fleetManagerTenantError(tenant_id: string, record_tenant_id: string): ErrorType | "none" {
  if (record_tenant_id !== tenant_id) {
    return "tenant_id mismatch";
  }
  return "none";
}

export function fleetManagerAccessError(role: DtoRole): ErrorType | "none" {
  if (canAccessFleetManagerDashboard(role) === false) {
    return "role unauthorized";
  }
  return "none";
}

export function isSevereBreakdown(severity: string): boolean {
  if (severity === "S1") {
    return true;
  }
  if (severity === "S2") {
    return true;
  }
  return false;
}

export function isOpenWorkorder(status: string): boolean {
  if (status === "completed") {
    return false;
  }
  if (status === "closed") {
    return false;
  }
  return true;
}
