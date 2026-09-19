/**
 * Validation Layer — Core
 * Master Blueprint V2 / DATABASE-SCHEMA §1
 * Zod-style timestamp schema. deleted_at is string or null.
 */

import { freezeTimestampDto, type TimestampDto } from "../dto/timestamp.dto";
import { asRecord, asString, createValidationResult, type ValidationResult } from "./dto.schema";
import { parseDtoRole } from "./role.schema";

export const timestampSchema = {
  safeParse(input: unknown, engine_tenant_id: string): ValidationResult<TimestampDto> {
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
    const created_at = asString(record.created_at);
    if (created_at === "") {
      return createValidationResult(false, null, "timestamp required");
    }
    const updated_at = asString(record.updated_at);
    if (updated_at === "") {
      return createValidationResult(false, null, "timestamp required");
    }
    let deleted_at: string | null = null;
    if (record.deleted_at !== null) {
      if (record.deleted_at !== undefined) {
        const deleted = asString(record.deleted_at);
        if (deleted === "") {
          return createValidationResult(false, null, "dto invalid");
        }
        deleted_at = deleted;
      }
    }
    return createValidationResult(
      true,
      freezeTimestampDto(tenant_id, role, timestamp, created_at, updated_at, deleted_at),
      "none",
    );
  },
};
