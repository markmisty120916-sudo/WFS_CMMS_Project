import { asRecord, asString, createValidationResult, type ValidationResult } from "../../../core/validation/dto.schema";
import type { ReorderInput } from "../inventory.interface";
import { asFieldString } from "../utils/inventory-normalizer";

export function parseReorderPartDto(input: unknown): ValidationResult<ReorderInput> {
  const record = asRecord(input);
  if (record === null) {
    return createValidationResult(false, null, "dto invalid");
  }
  const part_id = asString(record.part_id);
  const quantity = asFieldString(record.quantity);
  const vendor_name = asString(record.vendor_name);
  if (part_id === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  if (quantity === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  if (vendor_name === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  return createValidationResult(
    true,
    Object.freeze({
      part_id,
      quantity,
      vendor_name,
      reorder_point: asFieldString(record.reorder_point),
      workorder_id: asString(record.workorder_id),
    }),
    "none",
  );
}
