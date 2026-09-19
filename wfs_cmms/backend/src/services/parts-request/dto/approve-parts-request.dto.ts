import { asRecord, asString, createValidationResult, type ValidationResult } from "../../../core/validation/dto.schema";
import type { PartsRequestApproveInput } from "../parts-request.interface";

export function parseApprovePartsRequestDto(input: unknown): ValidationResult<PartsRequestApproveInput> {
  if (input === undefined) {
    return createValidationResult(
      true,
      Object.freeze({
        reason: "",
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
      reason: asString(record.reason),
    }),
    "none",
  );
}
