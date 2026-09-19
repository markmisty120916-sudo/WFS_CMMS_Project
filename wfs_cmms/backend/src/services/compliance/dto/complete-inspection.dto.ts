import { asRecord, asString, createValidationResult, type ValidationResult } from "../../../core/validation/dto.schema";
import type { InspectionCompleteInput } from "../compliance.interface";

export function parseCompleteInspectionDto(
  input: unknown,
): ValidationResult<InspectionCompleteInput> {
  const record = asRecord(input);
  if (record === null) {
    return createValidationResult(false, null, "dto invalid");
  }
  const findings = asString(record.findings);
  const result = asString(record.result);
  if (findings === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  if (result !== "passed") {
    if (result !== "failed") {
      return createValidationResult(false, null, "dto invalid");
    }
  }
  return createValidationResult(
    true,
    Object.freeze({
      findings,
      result,
    }),
    "none",
  );
}
