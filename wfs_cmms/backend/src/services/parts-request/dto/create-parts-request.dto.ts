import { asRecord, asString, createValidationResult, type ValidationResult } from "../../../core/validation/dto.schema";
import type { PartsRequestWriteInput } from "../parts-request.interface";
import { asFieldString } from "../utils/parts-request-normalizer";

export function parseCreatePartsRequestDto(input: unknown): ValidationResult<PartsRequestWriteInput> {
  const record = asRecord(input);
  if (record === null) {
    return createValidationResult(false, null, "dto invalid");
  }
  const workorder_id = asString(record.workorder_id);
  const part_id = asString(record.part_id);
  const quantity = asFieldString(record.quantity);
  if (workorder_id === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  if (part_id === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  if (quantity === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  return createValidationResult(
    true,
    Object.freeze({
      workorder_id,
      part_id,
      quantity,
    }),
    "none",
  );
}
