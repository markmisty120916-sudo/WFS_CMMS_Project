import { asRecord, asString, createValidationResult, type ValidationResult } from "../../../core/validation/dto.schema";
import { isInspectionType } from "../compliance-rules";
import type { InspectionInstanceWriteInput } from "../compliance.interface";

export function parseCreateInspectionInstanceDto(
  input: unknown,
): ValidationResult<InspectionInstanceWriteInput> {
  const record = asRecord(input);
  if (record === null) {
    return createValidationResult(false, null, "dto invalid");
  }
  const asset_id = asString(record.asset_id);
  const type = asString(record.type);
  if (asset_id === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  if (isInspectionType(type) === false) {
    return createValidationResult(false, null, "dto invalid");
  }
  return createValidationResult(
    true,
    Object.freeze({
      asset_id,
      type,
    }),
    "none",
  );
}
