import { asRecord, asString, createValidationResult, type ValidationResult } from "../../../core/validation/dto.schema";
import type { PmCompleteInput } from "../pm.interface";

export function parseCompletePmDto(input: unknown): ValidationResult<PmCompleteInput> {
  const record = asRecord(input);
  if (record === null) {
    return createValidationResult(false, null, "dto invalid");
  }
  const findings = asString(record.findings);
  const technician_id = asString(record.technician_id);
  if (findings === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  if (technician_id === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  return createValidationResult(
    true,
    Object.freeze({
      findings,
      technician_id,
    }),
    "none",
  );
}
