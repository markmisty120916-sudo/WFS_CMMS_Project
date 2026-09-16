/**
 * AIMI Voice NLP Engine
 * Master Blueprint V2 / VOICE-COMMANDS §16 / voice.md §6
 * Immutable voice output. Original and translated text both stored.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type { SupportedLanguage } from "../multilingual-nlp/multilingual-inputs.interface";
import type {
  VoiceCommandCategory,
  VoiceCommandTarget,
  VoiceCommandType,
  VoiceInputSource,
  VoiceInputs,
  VoiceProfile,
} from "./voice-inputs.interface";

export type VoiceOutput = {
  readonly original_text: string;
  readonly translated_text: string;
  readonly detected_language: SupportedLanguage;
  readonly normalized_phonemes: string;
  readonly command_type: VoiceCommandType;
  readonly command_category: VoiceCommandCategory;
  readonly command_target: VoiceCommandTarget;
  readonly command_parameter: string;
  readonly source: VoiceInputSource;
  readonly voice_profile: VoiceProfile;
  readonly voice_inputs: VoiceInputs;
  readonly voice_timestamp: string;
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
};

export function freezeVoiceProfile(profile: VoiceProfile): VoiceProfile {
  return Object.freeze({
    tenant_id: profile.tenant_id,
    user_id: profile.user_id,
    language: profile.language,
    source: profile.source,
  });
}

export function freezeVoiceOutput(output: VoiceOutput): VoiceOutput {
  return Object.freeze({
    original_text: output.original_text,
    translated_text: output.translated_text,
    detected_language: output.detected_language,
    normalized_phonemes: output.normalized_phonemes,
    command_type: output.command_type,
    command_category: output.command_category,
    command_target: output.command_target,
    command_parameter: output.command_parameter,
    source: output.source,
    voice_profile: freezeVoiceProfile(output.voice_profile),
    voice_inputs: output.voice_inputs,
    voice_timestamp: output.voice_timestamp,
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
  });
}
