import { asRecord, asString, createValidationResult, type ValidationResult } from "../../../core/validation/dto.schema";
import type { PmInstanceWriteInput } from "../pm.interface";
import { asFieldString } from "../utils/pm-normalizer";

export function parseCreatePmInstanceDto(input: unknown): ValidationResult<PmInstanceWriteInput> {
  const record = asRecord(input);
  if (record === null) {
    return createValidationResult(false, null, "dto invalid");
  }
  const asset_id = asString(record.asset_id);
  const pm_template_id = asString(record.pm_template_id);
  const due_miles = asFieldString(record.due_miles);
  const due_hours = asFieldString(record.due_hours);
  if (asset_id === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  if (pm_template_id === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  return createValidationResult(
    true,
    Object.freeze({
      asset_id,
      pm_template_id,
      due_miles,
      due_hours,
    }),
    "none",
  );
}
