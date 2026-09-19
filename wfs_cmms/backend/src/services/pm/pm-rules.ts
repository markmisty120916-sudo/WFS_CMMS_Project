import type { DtoRole } from "../../core/dto/base.dto";
import type { ErrorType } from "../../core/errors/error-types";

export function canWritePm(role: DtoRole): boolean {
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

export function canReadAllPm(role: DtoRole): boolean {
  return canWritePm(role);
}

export function canReadLinkedPm(role: DtoRole): boolean {
  if (role === "DRIVER") {
    return true;
  }
  if (role === "COMPLIANCE OFFICER") {
    return true;
  }
  return false;
}

export function pmTenantError(tenant_id: string, record_tenant_id: string): ErrorType | "none" {
  if (record_tenant_id !== tenant_id) {
    return "tenant_id mismatch";
  }
  return "none";
}

export function pmWriteError(role: DtoRole): ErrorType | "none" {
  if (canWritePm(role) === false) {
    return "role unauthorized";
  }
  return "none";
}

export function pmReadError(role: DtoRole, entity_id: string, asset_id: string): ErrorType | "none" {
  if (canReadAllPm(role) === true) {
    return "none";
  }
  if (canReadLinkedPm(role) === true) {
    if (entity_id === "") {
      return "entity_id required";
    }
    if (entity_id !== asset_id) {
      return "role unauthorized";
    }
    return "none";
  }
  return "role unauthorized";
}

export function pmListError(role: DtoRole, entity_id: string): ErrorType | "none" {
  if (canReadAllPm(role) === true) {
    return "none";
  }
  if (canReadLinkedPm(role) === true) {
    if (entity_id === "") {
      return "entity_id required";
    }
    return "none";
  }
  return "role unauthorized";
}

export function pmCompletedImmutableError(status: string): ErrorType | "none" {
  if (status === "completed") {
    return "lifecycle transition invalid";
  }
  return "none";
}
