import { asRecord, asString, createValidationResult, type ValidationResult } from "../../../core/validation/dto.schema";
import type { PartsRequestStatusQuery } from "../parts-request.interface";

export function parsePartsRequestStatusDto(input: unknown): ValidationResult<PartsRequestStatusQuery> {
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
