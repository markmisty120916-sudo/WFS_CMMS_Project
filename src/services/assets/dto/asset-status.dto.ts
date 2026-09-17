import { asRecord, asString, createValidationResult, type ValidationResult } from "../../../core/validation/dto.schema";
import type { AssetListQuery } from "../assets.interface";

export function parseAssetStatusDto(input: unknown): ValidationResult<AssetListQuery> {
  if (input === undefined) {
    return createValidationResult(
      true,
      Object.freeze({
        status: "",
        group_id: "",
      }),
      "none",
    );
  }
  const record = asRecord(input);
  if (record === null) {
    return createValidationResult(false, null, "dto invalid");
  }
  const status = asString(record.status);
  const group_id = asString(record.group_id);
  return createValidationResult(
    true,
    Object.freeze({
      status,
      group_id,
    }),
    "none",
  );
}
