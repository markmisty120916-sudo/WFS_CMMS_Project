/**
 * Assets Service
 * Master Blueprint V2 / RBAC §3 / TENANT-ISOLATION / API-SPEC §3
 * Read/write gates. DRIVER is assigned-asset only. No RBAC bypass.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type { ErrorType } from "../../core/errors/error-types";

export function canWriteAsset(role: DtoRole): boolean {
  if (role === "ADMIN") {
    return true;
  }
  if (role === "SILENT MASTER KEY") {
    return true;
  }
  return false;
}

export function canViewAssetDetails(role: DtoRole): boolean {
  if (role === "TECHNICIAN") {
    return true;
  }
  if (role === "MASTER TECHNICIAN") {
    return true;
  }
  if (role === "PARTS MANAGER") {
    return true;
  }
  if (role === "FLEET MANAGER") {
    return true;
  }
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

export function canViewAllAssets(role: DtoRole): boolean {
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

export function canViewAssignedAsset(role: DtoRole): boolean {
  if (role === "DRIVER") {
    return true;
  }
  return false;
}

export function assetTenantError(tenant_id: string, record_tenant_id: string): ErrorType | "none" {
  if (record_tenant_id !== tenant_id) {
    return "tenant_id mismatch";
  }
  return "none";
}

export function assetReadError(
  role: DtoRole,
  entity_id: string,
  asset_id: string,
): ErrorType | "none" {
  if (canViewAssetDetails(role) === true) {
    return "none";
  }
  if (canViewAssignedAsset(role) === true) {
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

export function assetListError(role: DtoRole, entity_id: string): ErrorType | "none" {
  if (canViewAllAssets(role) === true) {
    return "none";
  }
  if (canViewAssetDetails(role) === true) {
    return "none";
  }
  if (canViewAssignedAsset(role) === true) {
    if (entity_id === "") {
      return "entity_id required";
    }
    return "none";
  }
  return "role unauthorized";
}

export function assetWriteError(role: DtoRole): ErrorType | "none" {
  if (canWriteAsset(role) === false) {
    return "role unauthorized";
  }
  return "none";
}
