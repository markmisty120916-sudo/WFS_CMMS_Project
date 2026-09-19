import { asRecord, asString, createValidationResult, type ValidationResult } from "../../../core/validation/dto.schema";
import type { UpdateWorkflowStepInput } from "../technician-workflow.interface";
import { asBooleanFlag, asFieldString } from "../utils/technician-workflow-normalizer";

export function parseUpdateWorkflowStepDto(input: unknown): ValidationResult<UpdateWorkflowStepInput> {
  const record = asRecord(input);
  if (record === null) {
    return createValidationResult(false, null, "dto invalid");
  }
  const note_text = asString(record.note_text);
  if (note_text === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  return createValidationResult(
    true,
    Object.freeze({
      note_text,
      skipped: asBooleanFlag(record.skipped),
      hours: asFieldString(record.hours),
    }),
    "none",
  );
}
