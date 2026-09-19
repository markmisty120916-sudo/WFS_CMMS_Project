import type { DtoRole } from "@/dto/base.dto";
import type { ErrorType } from "@/errors/error-types";
import { parseDtoRole } from "@/validation/role.schema";

export function canAccessAssetManager(role: DtoRole): boolean {
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

export function assetManagerTenantError(tenant_id: string, record_tenant_id: string): ErrorType | "none" {
  if (record_tenant_id !== tenant_id) {
    return "tenant_id mismatch";
  }
  return "none";
}

export function assetManagerWriteError(role: DtoRole): ErrorType | "none" {
  if (canAccessAssetManager(role) === false) {
    return "role unauthorized";
  }
  return "none";
}

export function mapAuthorizedEmployeeRole(value: string): DtoRole | null {
  if (value === "SysAdmin") {
    return "ADMIN";
  }
  if (value === "SYSADMIN") {
    return "ADMIN";
  }
  return parseDtoRole(value);
}

export function isVinFormat(vin: string): boolean {
  if (vin.length !== 17) {
    return false;
  }
  const allowed = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789";
  let index = 0;
  while (index < vin.length) {
    const ch = vin.charAt(index).toUpperCase();
    if (allowed.indexOf(ch) < 0) {
      return false;
    }
    index = index + 1;
  }
  return true;
}

export function isPmIntervalSane(interval_miles: string, interval_hours: string): boolean {
  if (interval_miles === "") {
    return false;
  }
  if (interval_hours === "") {
    return false;
  }
  const miles = Number(interval_miles);
  const hours = Number(interval_hours);
  if (Number.isFinite(miles) === false) {
    return false;
  }
  if (Number.isFinite(hours) === false) {
    return false;
  }
  if (miles <= 0) {
    return false;
  }
  if (hours <= 0) {
    return false;
  }
  if (miles > 1000000) {
    return false;
  }
  if (hours > 100000) {
    return false;
  }
  return true;
}

export function isSeverityLevel(value: string): boolean {
  if (value === "S1") {
    return true;
  }
  if (value === "S2") {
    return true;
  }
  if (value === "S3") {
    return true;
  }
  if (value === "S4") {
    return true;
  }
  if (value === "S5") {
    return true;
  }
  return false;
}
