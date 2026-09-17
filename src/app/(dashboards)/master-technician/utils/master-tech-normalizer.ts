import type { DtoRole } from "../../../../core/dto/base.dto";
import type { MasterTechLanguage, MasterTechSession } from "../master-tech.interface";

function asString(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value === null) {
    return null;
  }
  if (typeof value !== "object") {
    return null;
  }
  if (Array.isArray(value) === true) {
    return null;
  }
  return value as Record<string, unknown>;
}

function isDtoRole(value: string): value is DtoRole {
  if (value === "DRIVER") {
    return true;
  }
  if (value === "TECHNICIAN") {
    return true;
  }
  if (value === "MASTER TECHNICIAN") {
    return true;
  }
  if (value === "PARTS MANAGER") {
    return true;
  }
  if (value === "FLEET MANAGER") {
    return true;
  }
  if (value === "COMPLIANCE OFFICER") {
    return true;
  }
  if (value === "ADMIN") {
    return true;
  }
  if (value === "SILENT MASTER KEY") {
    return true;
  }
  return false;
}

export function isMasterTechLanguage(value: string): value is MasterTechLanguage {
  if (value === "English") {
    return true;
  }
  if (value === "Spanish") {
    return true;
  }
  if (value === "French") {
    return true;
  }
  if (value === "German") {
    return true;
  }
  if (value === "Portuguese") {
    return true;
  }
  if (value === "Mandarin") {
    return true;
  }
  if (value === "Arabic") {
    return true;
  }
  return false;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }
  if (parts[0] === "") {
    return null;
  }
  if (parts[1] === "") {
    return null;
  }
  if (parts[2] === "") {
    return null;
  }
  try {
    const json = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    const parsed: unknown = JSON.parse(json);
    return asRecord(parsed);
  } catch {
    return null;
  }
}

function storageValue(key: string): string {
  if (typeof window === "undefined") {
    return "";
  }
  const fromSession = window.sessionStorage.getItem(key);
  if (fromSession !== null) {
    return fromSession.trim();
  }
  const fromLocal = window.localStorage.getItem(key);
  if (fromLocal !== null) {
    return fromLocal.trim();
  }
  return "";
}

export function loadMasterTechSession(): MasterTechSession | null {
  const token = storageValue("wfs.cmms.token");
  if (token === "") {
    return null;
  }
  const payload = decodeJwtPayload(token);
  if (payload === null) {
    return null;
  }
  const tokenTenantId = asString(payload.tenant_id);
  const headerTenantId = storageValue("wfs.cmms.tenant_id");
  if (tokenTenantId === "") {
    return null;
  }
  if (headerTenantId !== "") {
    if (headerTenantId !== tokenTenantId) {
      return null;
    }
  }
  const user_id = asString(payload.user_id);
  if (user_id === "") {
    return null;
  }
  const roleClaim = asString(payload.role);
  if (isDtoRole(roleClaim) === false) {
    return null;
  }
  let timestamp = asString(payload.timestamp);
  if (timestamp === "") {
    if (typeof payload.iat !== "number") {
      timestamp = new Date().toISOString();
    } else {
      timestamp = new Date(payload.iat * 1000).toISOString();
    }
  }
  return Object.freeze({
    tenant_id: tokenTenantId,
    user_id,
    role: roleClaim,
    token,
    timestamp,
  });
}

export function normalizeUnknownArray(payload: unknown): readonly unknown[] {
  if (Array.isArray(payload) === true) {
    return payload;
  }
  const record = asRecord(payload);
  if (record === null) {
    return [];
  }
  const nestedKeys = ["items", "data", "workorders", "assets", "schedules", "parts", "inspections", "events", "insights"];
  let index = 0;
  while (index < nestedKeys.length) {
    const nested = record[nestedKeys[index]];
    if (Array.isArray(nested) === true) {
      return nested;
    }
    index = index + 1;
  }
  return [payload];
}

export function readStringField(record: Record<string, unknown>, keys: readonly string[]): string {
  let index = 0;
  while (index < keys.length) {
    const value = asString(record[keys[index]]);
    if (value !== "") {
      return value;
    }
    index = index + 1;
  }
  return "";
}

export function readBooleanField(record: Record<string, unknown>, keys: readonly string[]): boolean {
  let index = 0;
  while (index < keys.length) {
    const value = record[keys[index]];
    if (value === true) {
      return true;
    }
    index = index + 1;
  }
  return false;
}

export function asDataRecord(value: unknown): Record<string, unknown> | null {
  return asRecord(value);
}
