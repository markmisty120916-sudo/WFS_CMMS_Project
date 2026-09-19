import type { DtoRole } from "../../core/dto/base.dto";
import type { ErrorType } from "../../core/errors/error-types";

export function canWriteInventory(role: DtoRole): boolean {
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

export function canReadInventory(role: DtoRole): boolean {
  if (canWriteInventory(role) === true) {
    return true;
  }
  if (role === "TECHNICIAN") {
    return true;
  }
  return false;
}

export function canPublishInventoryEvent(role: DtoRole): boolean {
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

export function canStartInventoryLifecycle(role: DtoRole): boolean {
  if (role === "PARTS MANAGER") {
    return true;
  }
  if (role === "TECHNICIAN") {
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

export function inventoryTenantError(tenant_id: string, record_tenant_id: string): ErrorType | "none" {
  if (record_tenant_id !== tenant_id) {
    return "tenant_id mismatch";
  }
  return "none";
}

export function inventoryWriteError(role: DtoRole): ErrorType | "none" {
  if (canWriteInventory(role) === false) {
    return "role unauthorized";
  }
  return "none";
}

export function inventoryReadError(role: DtoRole): ErrorType | "none" {
  if (canReadInventory(role) === false) {
    return "role unauthorized";
  }
  return "none";
}
