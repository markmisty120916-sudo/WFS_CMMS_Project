/**
 * Validation Layer — Core
 * Master Blueprint V2 / DATABASE-SCHEMA §2.1 / TENANT-ISOLATION §2
 * Zod-style tenant schema. engine_tenant_id must match DTO tenant_id.
 */

import { freezeTenantDto, type TenantDto } from "../dto/tenant.dto";
import { asRecord, asString, createValidationResult, type ValidationResult } from "./dto.schema";
import { parseDtoRole } from "./role.schema";

export const tenantSchema = {
  safeParse(input: unknown, engine_tenant_id: string): ValidationResult<TenantDto> {
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
    const name = asString(record.name);
    if (name === "") {
      return createValidationResult(false, null, "dto invalid");
    }
    const status = asString(record.status);
    if (status === "") {
      return createValidationResult(false, null, "dto invalid");
    }
    return createValidationResult(
      true,
      freezeTenantDto(tenant_id, role, timestamp, name, status),
      "none",
    );
  },
};
