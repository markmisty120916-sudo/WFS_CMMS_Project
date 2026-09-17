import { asRecord, asString, createValidationResult, type ValidationResult } from "../../../core/validation/dto.schema";
import type { VendorWriteInput } from "../inventory.interface";
import { asFieldString } from "../utils/inventory-normalizer";

export function parseVendorDto(input: unknown): ValidationResult<VendorWriteInput> {
  const record = asRecord(input);
  if (record === null) {
    return createValidationResult(false, null, "dto invalid");
  }
  const vendor_name = asString(record.vendor_name);
  if (vendor_name === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  return createValidationResult(
    true,
    Object.freeze({
      vendor_name,
      location: asFieldString(record.location),
    }),
    "none",
  );
}
