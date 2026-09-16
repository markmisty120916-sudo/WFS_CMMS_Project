/**
 * AIMI Multilingual NLP Engine
 * Master Blueprint V2 / multilingual.md §12–§14
 * Immutable translation output. Original and translated text both stored.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type {
  LanguageProfile,
  MultilingualCommandTarget,
  MultilingualCommandType,
  MultilingualInputs,
  MultilingualSource,
  SupportedLanguage,
} from "./multilingual-inputs.interface";

export type MultilingualOutput = {
  readonly original_text: string;
  readonly translated_text: string;
  readonly detected_language: SupportedLanguage;
  readonly normalized_text: string;
  readonly command_type: MultilingualCommandType;
  readonly command_target: MultilingualCommandTarget;
  readonly command_parameter: string;
  readonly source: MultilingualSource;
  readonly language_profile: LanguageProfile;
  readonly multilingual_inputs: MultilingualInputs;
  readonly multilingual_timestamp: string;
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
};

export function freezeLanguageProfile(profile: LanguageProfile): LanguageProfile {
  return Object.freeze({
    tenant_id: profile.tenant_id,
    user_id: profile.user_id,
    language: profile.language,
  });
}

export function freezeMultilingualOutput(output: MultilingualOutput): MultilingualOutput {
  return Object.freeze({
    original_text: output.original_text,
    translated_text: output.translated_text,
    detected_language: output.detected_language,
    normalized_text: output.normalized_text,
    command_type: output.command_type,
    command_target: output.command_target,
    command_parameter: output.command_parameter,
    source: output.source,
    language_profile: freezeLanguageProfile(output.language_profile),
    multilingual_inputs: output.multilingual_inputs,
    multilingual_timestamp: output.multilingual_timestamp,
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
  });
}
