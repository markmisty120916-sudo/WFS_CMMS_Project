import type { DtoRole } from "../../../../src/core/dto/base.dto";

export function canAccessDriverPortal(role: DtoRole): boolean {
  if (role === "DRIVER") {
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

export function canMutateDriverPortal(role: DtoRole): boolean {
  if (role === "DRIVER") {
    return true;
  }
  if (role === "SILENT MASTER KEY") {
    return true;
  }
  return false;
}

export function isDriverPortalReadOnly(role: DtoRole): boolean {
  if (role === "FLEET MANAGER") {
    return true;
  }
  return false;
}

export function driverPortalTenantAllowed(session_tenant_id: string, record_tenant_id: string): boolean {
  if (session_tenant_id === "") {
    return false;
  }
  if (record_tenant_id !== session_tenant_id) {
    return false;
  }
  return true;
}
