import { asRecord, asString, createValidationResult, type ValidationResult } from "../../../core/validation/dto.schema";
import { isCodedDriverDefectSeverity } from "../driver-defect-rules";
import type { DriverDefectWriteInput } from "../driver-defect.interface";
import { asBooleanFlag, asFieldString } from "../utils/driver-defect-normalizer";

export function parseUpdateDriverDefectDto(input: unknown): ValidationResult<DriverDefectWriteInput> {
  const record = asRecord(input);
  if (record === null) {
    return createValidationResult(false, null, "dto invalid");
  }
  const asset_id = asString(record.asset_id);
  const description = asString(record.description);
  const severity = asString(record.severity);
  if (asset_id === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  if (description === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  if (isCodedDriverDefectSeverity(severity) === false) {
    return createValidationResult(false, null, "dto invalid");
  }
  return createValidationResult(
    true,
    Object.freeze({
      asset_id,
      description,
      severity,
      photo_url: asFieldString(record.photo_url),
      voice: asBooleanFlag(record.voice),
      multilingual: asBooleanFlag(record.multilingual),
    }),
    "none",
  );
}
