import type { DtoRole } from "@/dto/base.dto";
import type { ErrorType } from "@/errors/error-types";

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

export function driverPortalAccessError(role: DtoRole): ErrorType | "none" {
  if (canAccessDriverPortal(role) === false) {
    return "role unauthorized";
  }
  return "none";
}

export function driverPortalMutateError(role: DtoRole): ErrorType | "none" {
  if (canMutateDriverPortal(role) === false) {
    return "role unauthorized";
  }
  return "none";
}

export function matchesDriverAsset(asset_id: string, filter_asset: string): boolean {
  if (filter_asset === "") {
    return true;
  }
  if (asset_id === filter_asset) {
    return true;
  }
  return false;
}
