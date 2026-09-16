/**
 * AIMI Voice NLP Engine
 * Master Blueprint V2 / VOICE-COMMANDS §2–§11 / voice.md §3
 * Coded phoneme catalogs only. No inferred speech. No cross-tenant profiles.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type {
  LanguageProfile,
  SupportedLanguage,
  TranslationDictionaryEntry,
} from "../multilingual-nlp/multilingual-inputs.interface";

export type VoiceCommandCategory =
  | "Workorder Commands"
  | "Diagnostic Commands"
  | "Asset Commands"
  | "Scheduling Commands"
  | "PM Commands"
  | "Compliance Commands"
  | "Navigation Commands"
  | "AIMI Commands";

export type VoiceCommandTarget =
  | "workorders"
  | "diagnostics"
  | "assets"
  | "scheduling"
  | "pm"
  | "compliance"
  | "ui"
  | "aimi.core";

export type VoiceInputSource =
  | "technician mobile app"
  | "technician tablet"
  | "shop kiosk"
  | "driver kiosk"
  | "desktop browser"
  | "HUD Mode";

export type VoiceCommandType =
  | "Create a workorder for this bus."
  | "Add a note to this workorder."
  | "Add a photo to this workorder."
  | "Assign this to a technician."
  | "Close this workorder."
  | "Show recommended repair."
  | "Show verification steps."
  | "AIMI, diagnose this issue."
  | "Next step."
  | "Repeat step."
  | "Skip step."
  | "Explain this step."
  | "Show recommended parts."
  | "Show fault history."
  | "Show asset health."
  | "Show telematics data."
  | "Show predictive alerts."
  | "Show PM schedule."
  | "Show compliance status."
  | "Schedule this repair."
  | "Assign a bay."
  | "Assign a technician."
  | "Show availability."
  | "Show scheduling window."
  | "Start PM."
  | "Log PM findings."
  | "Complete PM."
  | "Show PM checklist."
  | "Start inspection."
  | "Log inspection findings."
  | "Complete inspection."
  | "Go to workorders."
  | "Go to assets."
  | "Go to diagnostics."
  | "Go to scheduling."
  | "Go to PM."
  | "Go to compliance."
  | "AIMI, explain this."
  | "AIMI, summarize this."
  | "AIMI, show insights."
  | "AIMI, show predictive risk."
  | "AIMI, show recommended action.";

export type VoiceProfile = {
  readonly tenant_id: string;
  readonly user_id: string;
  readonly language: SupportedLanguage;
  readonly source: VoiceInputSource;
};

export type PhonemeCatalogEntry = {
  readonly tenant_id: string;
  readonly language: SupportedLanguage;
  readonly phoneme_sequence: string;
  readonly source_token: string;
  readonly command_type: VoiceCommandType;
  readonly command_category: VoiceCommandCategory;
  readonly command_target: VoiceCommandTarget;
  readonly command_parameter: string;
};

export type VoiceInputs = {
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
  readonly timestamp: string;
  readonly workorder_id: string;
  readonly asset_id: string;
  readonly technician_id: string;
  readonly phoneme_sequence: string;
  readonly meets_confidence_threshold: boolean;
  readonly voice_profile: VoiceProfile;
  readonly language_profile: LanguageProfile;
  readonly phoneme_catalog: readonly PhonemeCatalogEntry[];
  readonly dictionary: readonly TranslationDictionaryEntry[];
};
