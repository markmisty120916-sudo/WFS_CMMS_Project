import { asRecord, asString, createValidationResult, type ValidationResult } from "../../../core/validation/dto.schema";
import type { StockAdjustInput } from "../inventory.interface";
import { asFieldString, asFiniteNumber } from "../utils/inventory-normalizer";

export function parseAdjustStockDto(input: unknown): ValidationResult<StockAdjustInput> {
  const record = asRecord(input);
  if (record === null) {
    return createValidationResult(false, null, "dto invalid");
  }
  const delta = asFieldString(record.delta);
  if (asFiniteNumber(delta) === null) {
    return createValidationResult(false, null, "dto invalid");
  }
  return createValidationResult(
    true,
    Object.freeze({
      delta,
      reason: asString(record.reason),
      workorder_id: asString(record.workorder_id),
    }),
    "none",
  );
}
