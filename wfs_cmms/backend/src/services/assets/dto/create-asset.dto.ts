import { asRecord, asString, createValidationResult, type ValidationResult } from "../../../core/validation/dto.schema";
import type { AssetWriteInput } from "../assets.interface";
import { asFieldString } from "../utils/asset-normalizer";

export function parseCreateAssetDto(input: unknown): ValidationResult<AssetWriteInput> {
  const record = asRecord(input);
  if (record === null) {
    return createValidationResult(false, null, "dto invalid");
  }
  const asset_number = asString(record.asset_number);
  const vin = asString(record.vin);
  const make = asString(record.make);
  const model = asString(record.model);
  const year = asFieldString(record.year);
  const type = asString(record.type);
  const location = asString(record.location);
  if (asset_number === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  if (vin === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  if (make === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  if (model === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  if (year === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  if (type === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  if (location === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  return createValidationResult(
    true,
    Object.freeze({
      asset_number,
      vin,
      make,
      model,
      year,
      type,
      location,
    }),
    "none",
  );
}
