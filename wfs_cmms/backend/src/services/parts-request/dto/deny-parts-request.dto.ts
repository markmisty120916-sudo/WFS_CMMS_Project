import { asRecord, asString, createValidationResult, type ValidationResult } from "../../../core/validation/dto.schema";
import type { PartsRequestDenyInput } from "../parts-request.interface";

export function parseDenyPartsRequestDto(input: unknown): ValidationResult<PartsRequestDenyInput> {
  const record = asRecord(input);
  if (record === null) {
    return createValidationResult(false, null, "dto invalid");
  }
  const reason = asString(record.reason);
  if (reason === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  return createValidationResult(
    true,
    Object.freeze({
      reason,
    }),
    "none",
  );
}
