import { asRecord, asString, createValidationResult, type ValidationResult } from "../../../core/validation/dto.schema";
import type { DriverDefectReportInput } from "../compliance.interface";

export function parseDriverDefectReportDto(
  input: unknown,
): ValidationResult<DriverDefectReportInput> {
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
  if (severity === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  return createValidationResult(
    true,
    Object.freeze({
      asset_id,
      description,
      severity,
    }),
    "none",
  );
}
