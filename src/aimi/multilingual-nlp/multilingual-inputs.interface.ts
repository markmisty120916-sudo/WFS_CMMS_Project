/**
 * AIMI Multilingual NLP Engine
 * Master Blueprint V2 / multilingual.md §2–§5
 * Coded dictionaries only. No inferred language. No cross-tenant tokens.
 */

import type { DtoRole } from "../../core/dto/base.dto";

export type SupportedLanguage =
  | "English"
  | "Spanish"
  | "French"
  | "German"
  | "Portuguese"
  | "Mandarin"
  | "Arabic";

export type MultilingualSource = "text" | "voice" | "notes";

export type MultilingualCommandType =
  | "Next step"
  | "Repeat step"
  | "Skip step"
  | "Explain step"
  | "Add note"
  | "Add photo"
  | "Request part"
  | "Show verification"
  | "Show severity"
  | "Show routing"
  | "Show scheduling";

export type MultilingualCommandTarget =
  | "diagnostic"
  | "workorder"
  | "inventory"
  | "verification"
  | "severity"
  | "routing"
  | "scheduling";

export type LanguageProfile = {
  readonly tenant_id: string;
  readonly user_id: string;
  readonly language: SupportedLanguage;
};

export type TranslationDictionaryEntry = {
  readonly tenant_id: string;
  readonly language: SupportedLanguage;
  readonly source_token: string;
  readonly internal_token: string;
  readonly command_type: MultilingualCommandType;
  readonly command_target: MultilingualCommandTarget;
  readonly command_parameter: string;
};

export type MultilingualInputs = {
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
  readonly timestamp: string;
  readonly workorder_id: string;
  readonly asset_id: string;
  readonly technician_id: string;
  readonly original_text: string;
  readonly source: MultilingualSource;
  readonly language_profile: LanguageProfile;
  readonly dictionary: readonly TranslationDictionaryEntry[];
};
