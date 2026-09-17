import { asRecord, asString, createValidationResult, type ValidationResult } from "../../../core/validation/dto.schema";
import type { DriverDefectStatusQuery } from "../driver-defect.interface";

export function parseDriverDefectStatusDto(input: unknown): ValidationResult<DriverDefectStatusQuery> {
  if (input === undefined) {
    return createValidationResult(
      true,
      Object.freeze({
        status: "",
      }),
      "none",
    );
  }
  const record = asRecord(input);
  if (record === null) {
    return createValidationResult(false, null, "dto invalid");
  }
  return createValidationResult(
    true,
    Object.freeze({
      status: asString(record.status),
    }),
    "none",
  );
}
