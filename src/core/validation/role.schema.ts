/**
 * Validation Layer — Core
 * Master Blueprint V2 / RBAC §2
 * Zod-style role schema. No RBAC bypass. Silent Master Key still requires tenant_id.
 */

import type { DtoRole } from "../dto/base.dto";
import { freezeRoleDto, type RoleDto } from "../dto/role.dto";
import { asRecord, asString, createValidationResult, type ValidationResult } from "./dto.schema";

export function parseDtoRole(value: unknown): DtoRole | null {
  if (value === "DRIVER") {
    return "DRIVER";
  }
  if (value === "TECHNICIAN") {
    return "TECHNICIAN";
  }
  if (value === "MASTER TECHNICIAN") {
    return "MASTER TECHNICIAN";
  }
  if (value === "PARTS MANAGER") {
    return "PARTS MANAGER";
  }
  if (value === "FLEET MANAGER") {
    return "FLEET MANAGER";
  }
  if (value === "COMPLIANCE OFFICER") {
    return "COMPLIANCE OFFICER";
  }
  if (value === "ADMIN") {
    return "ADMIN";
  }
  if (value === "SILENT MASTER KEY") {
    return "SILENT MASTER KEY";
  }
  return null;
}

export const roleSchema = {
  safeParse(input: unknown, engine_tenant_id: string): ValidationResult<RoleDto> {
    if (engine_tenant_id === "") {
      return createValidationResult(false, null, "tenant_id required");
    }
    const record = asRecord(input);
    if (record === null) {
      return createValidationResult(false, null, "dto invalid");
    }
    const tenant_id = asString(record.tenant_id);
    if (tenant_id === "") {
      return createValidationResult(false, null, "tenant_id required");
    }
    if (tenant_id !== engine_tenant_id) {
      return createValidationResult(false, null, "tenant_id mismatch");
    }
    const timestamp = asString(record.timestamp);
    if (timestamp === "") {
      return createValidationResult(false, null, "timestamp required");
    }
    const role = parseDtoRole(record.role);
    if (role === null) {
      return createValidationResult(false, null, "role invalid");
    }
    const role_id = asString(record.role_id);
    if (role_id === "") {
      return createValidationResult(false, null, "dto invalid");
    }
    const role_name = parseDtoRole(record.role_name);
    if (role_name === null) {
      return createValidationResult(false, null, "role invalid");
    }
    if (role_name !== role) {
      return createValidationResult(false, null, "role unauthorized");
    }
    return createValidationResult(
      true,
      freezeRoleDto(tenant_id, role, timestamp, role_id),
      "none",
    );
  },
};
