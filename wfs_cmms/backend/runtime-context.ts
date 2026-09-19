import type { IncomingMessage } from "http";
import { freezeContextDto, type ContextDto } from "@/dto/context.dto";
import type { DtoRole } from "@/dto/base.dto";

function headerValue(req: IncomingMessage, name: string): string {
  const value = req.headers[name];
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value) === true && value.length > 0) {
    return value[0];
  }
  return "";
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

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }
  try {
    const json = Buffer.from(parts[1], "base64url").toString("utf8");
    const parsed: unknown = JSON.parse(json);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed) === true) {
      return null;
    }
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

function asClaim(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  return value;
}

function emptyContext(): ContextDto {
  return freezeContextDto("", "DRIVER", new Date().toISOString(), "", "", "", "", "", "", "");
}

export function requestToContextDto(req: IncomingMessage): ContextDto {
  const tenantHeader = headerValue(req, "x-tenant-id");
  const authorization = headerValue(req, "authorization");
  if (tenantHeader === "") {
    return emptyContext();
  }
  if (authorization.indexOf("Bearer ") !== 0) {
    return emptyContext();
  }
  const token = authorization.slice("Bearer ".length);
  if (token === "") {
    return emptyContext();
  }
  const payload = decodeJwtPayload(token);
  if (payload === null) {
    return emptyContext();
  }
  const tokenTenantId = asClaim(payload.tenant_id);
  if (tokenTenantId === "" || tokenTenantId !== tenantHeader) {
    return emptyContext();
  }
  const user_id = asClaim(payload.user_id);
  const roleClaim = asClaim(payload.role);
  if (isDtoRole(roleClaim) === false) {
    return emptyContext();
  }
  let timestamp = asClaim(payload.timestamp);
  if (timestamp === "") {
    timestamp = new Date().toISOString();
  }
  const correlation_id = asClaim(payload.correlation_id);
  return freezeContextDto(
    tenantHeader,
    roleClaim,
    timestamp,
    user_id,
    correlation_id,
    "",
    "",
    "",
    "",
    "",
  );
}
