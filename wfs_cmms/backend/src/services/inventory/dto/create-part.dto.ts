import { asRecord, asString, createValidationResult, type ValidationResult } from "../../../core/validation/dto.schema";
import type { PartWriteInput } from "../inventory.interface";
import { asFieldString } from "../utils/inventory-normalizer";

export function parseCreatePartDto(input: unknown): ValidationResult<PartWriteInput> {
  const record = asRecord(input);
  if (record === null) {
    return createValidationResult(false, null, "dto invalid");
  }
  const name = asString(record.name);
  if (name === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  return createValidationResult(
    true,
    Object.freeze({
      name,
      description: asFieldString(record.description),
      quantity: asFieldString(record.quantity),
      location: asFieldString(record.location),
    }),
    "none",
  );
}
