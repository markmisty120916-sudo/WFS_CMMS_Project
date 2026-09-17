import type { DtoRole } from "../../core/dto/base.dto";
import type { ErrorType } from "../../core/errors/error-types";

export function canManagePartsRequest(role: DtoRole): boolean {
  if (role === "PARTS MANAGER") {
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

export function canCreatePartsRequest(role: DtoRole): boolean {
  if (canManagePartsRequest(role) === true) {
    return true;
  }
  if (role === "TECHNICIAN") {
    return true;
  }
  return false;
}

export function canReadPartsRequest(role: DtoRole): boolean {
  return canCreatePartsRequest(role);
}

export function canPublishPartsRequestEvent(role: DtoRole): boolean {
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

export function isPartsRequestOpen(status: string): boolean {
  if (status === "submitted") {
    return true;
  }
  return false;
}

export function isPartsRequestDecided(status: string): boolean {
  if (status === "approved") {
    return true;
  }
  if (status === "denied") {
    return true;
  }
  return false;
}

export function partsRequestTenantError(tenant_id: string, record_tenant_id: string): ErrorType | "none" {
  if (record_tenant_id !== tenant_id) {
    return "tenant_id mismatch";
  }
  return "none";
}

export function partsRequestCreateError(role: DtoRole): ErrorType | "none" {
  if (canCreatePartsRequest(role) === false) {
    return "role unauthorized";
  }
  return "none";
}

export function partsRequestManageError(role: DtoRole): ErrorType | "none" {
  if (canManagePartsRequest(role) === false) {
    return "role unauthorized";
  }
  return "none";
}

export function partsRequestReadError(role: DtoRole): ErrorType | "none" {
  if (canReadPartsRequest(role) === false) {
    return "role unauthorized";
  }
  return "none";
}

export function partsRequestImmutableError(status: string): ErrorType | "none" {
  if (isPartsRequestDecided(status) === true) {
    return "lifecycle transition invalid";
  }
  return "none";
}
