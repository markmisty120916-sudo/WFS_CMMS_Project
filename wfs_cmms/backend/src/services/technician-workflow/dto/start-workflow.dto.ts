import { asRecord, asString, createValidationResult, type ValidationResult } from "../../../core/validation/dto.schema";
import type { StartWorkflowInput } from "../technician-workflow.interface";
import { asBooleanFlag } from "../utils/technician-workflow-normalizer";

export function parseStartWorkflowDto(input: unknown): ValidationResult<StartWorkflowInput> {
  const record = asRecord(input);
  if (record === null) {
    return createValidationResult(false, null, "dto invalid");
  }
  const workorder_id = asString(record.workorder_id);
  if (workorder_id === "") {
    return createValidationResult(false, null, "dto invalid");
  }
  return createValidationResult(
    true,
    Object.freeze({
      workorder_id,
      voice: asBooleanFlag(record.voice),
      multilingual: asBooleanFlag(record.multilingual),
    }),
    "none",
  );
}
