import { asRecord, asString, createValidationResult, type ValidationResult } from "../../../core/validation/dto.schema";
import type { CompleteWorkflowInput } from "../technician-workflow.interface";
import { asBooleanFlag, asFieldString } from "../utils/technician-workflow-normalizer";

export function parseCompleteWorkflowDto(input: unknown): ValidationResult<CompleteWorkflowInput> {
  const record = asRecord(input);
  if (record === null) {
    return createValidationResult(false, null, "dto invalid");
  }
  const outcome = asString(record.outcome);
  if (outcome === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  return createValidationResult(
    true,
    Object.freeze({
      outcome,
      hours: asFieldString(record.hours),
      voice: asBooleanFlag(record.voice),
      multilingual: asBooleanFlag(record.multilingual),
    }),
    "none",
  );
}
