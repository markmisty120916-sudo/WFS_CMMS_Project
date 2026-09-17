import { asRecord, asString, createValidationResult, type ValidationResult } from "../../../core/validation/dto.schema";
import type { PmTemplateWriteInput } from "../pm.interface";
import { asFieldString } from "../utils/pm-normalizer";

export function parseCreatePmTemplateDto(input: unknown): ValidationResult<PmTemplateWriteInput> {
  const record = asRecord(input);
  if (record === null) {
    return createValidationResult(false, null, "dto invalid");
  }
  const name = asString(record.name);
  const interval_miles = asFieldString(record.interval_miles);
  const interval_hours = asFieldString(record.interval_hours);
  const asset_group = asString(record.asset_group);
  const severity_default = asString(record.severity_default);
  if (name === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  if (interval_miles === "") {
    if (interval_hours === "") {
      return createValidationResult(false, null, "dto invalid");
    }
  }
  return createValidationResult(
    true,
    Object.freeze({
      name,
      interval_miles,
      interval_hours,
      asset_group,
      severity_default,
    }),
    "none",
  );
}
