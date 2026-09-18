import type { DtoRole } from "../../../../src/core/dto/base.dto";

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

export function complianceDashboardTenantAllowed(session_tenant_id: string, record_tenant_id: string): boolean {
  if (session_tenant_id === "") {
    return false;
  }
  if (record_tenant_id !== session_tenant_id) {
    return false;
  }
  return true;
}
