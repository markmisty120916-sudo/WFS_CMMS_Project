import type { DtoRole } from "../../../../src/core/dto/base.dto";

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

export function partsManagerTenantAllowed(session_tenant_id: string, record_tenant_id: string): boolean {
  if (session_tenant_id === "") {
    return false;
  }
  if (record_tenant_id !== session_tenant_id) {
    return false;
  }
  return true;
}
