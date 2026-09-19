import { asRecord, createValidationResult, type ValidationResult } from "../../../core/validation/dto.schema";
import type { TechnicianActionInput } from "../technician-workflow.interface";
import { asFieldString } from "../utils/technician-workflow-normalizer";

export function parseTechnicianActionDto(input: unknown): ValidationResult<TechnicianActionInput> {
  const record = asRecord(input);
  if (record === null) {
    return createValidationResult(false, null, "dto invalid");
  }
  const note_text = asFieldString(record.note_text);
  const hours = asFieldString(record.hours);
  if (note_text === "") {
    if (hours === "") {
      return createValidationResult(false, null, "dto invalid");
    }
  }
  return createValidationResult(
    true,
    Object.freeze({
      note_text,
      hours,
    }),
    "none",
  );
}
