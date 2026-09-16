/**
 * Validation Layer — Core
 * Master Blueprint V2 / AIMI-RULES §2.3
 * Zod-style result. All fields present. No partial DTO assembly.
 */

export type ValidationErrorCode =
  | "none"
  | "tenant_id required"
  | "tenant_id mismatch"
  | "role unauthorized"
  | "role invalid"
  | "timestamp required"
  | "dto invalid"
  | "lifecycle transition invalid";

export type ValidationResult<T> = {
  readonly success: boolean;
  readonly data: T | null;
  readonly error_code: ValidationErrorCode;
};

export function createValidationResult<T>(
  success: boolean,
  data: T | null,
  error_code: ValidationErrorCode,
): ValidationResult<T> {
  return Object.freeze({
    success,
    data,
    error_code,
  });
}

export function asRecord(input: unknown): Record<string, unknown> | null {
  if (input === null) {
    return null;
  }
  if (typeof input !== "object") {
    return null;
  }
  if (Array.isArray(input)) {
    return null;
  }
  return input as Record<string, unknown>;
}

export function asString(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  return value;
}
