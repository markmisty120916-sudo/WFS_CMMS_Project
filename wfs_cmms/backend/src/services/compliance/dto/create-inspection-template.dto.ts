import { asRecord, asString, createValidationResult, type ValidationResult } from "../../../core/validation/dto.schema";
import { isInspectionType } from "../compliance-rules";
import type { InspectionTemplateWriteInput } from "../compliance.interface";
import { asBooleanFlag } from "../utils/compliance-normalizer";

export function parseCreateInspectionTemplateDto(
  input: unknown,
): ValidationResult<InspectionTemplateWriteInput> {
  const record = asRecord(input);
  if (record === null) {
    return createValidationResult(false, null, "dto invalid");
  }
  const type = asString(record.type);
  if (isInspectionType(type) === false) {
    return createValidationResult(false, null, "dto invalid");
  }
  return createValidationResult(
    true,
    Object.freeze({
      type,
      frequency: asString(record.frequency),
      severity_default: asString(record.severity_default),
      voice_enabled: asBooleanFlag(record.voice_enabled),
      multilingual_enabled: asBooleanFlag(record.multilingual_enabled),
    }),
    "none",
  );
}
