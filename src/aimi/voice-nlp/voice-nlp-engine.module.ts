/**
 * AIMI Voice NLP Engine
 * Master Blueprint V2 / BACKEND-STRUCTURE §6 / VOICE-COMMANDS
 * Factory only. No Nest runtime. No global voice instance.
 */

import {
  VoiceNlpEngineService,
  type VoiceNlpEngineServiceOptions,
} from "./voice-nlp-engine.service";

export class VoiceNlpEngineModule {
  static create(options: VoiceNlpEngineServiceOptions): VoiceNlpEngineService {
    return new VoiceNlpEngineService(options);
  }
}

export { VoiceNlpEngineService } from "./voice-nlp-engine.service";
export type { VoiceNlpEngineServiceOptions } from "./voice-nlp-engine.service";
export type {
  PhonemeCatalogEntry,
  VoiceCommandCategory,
  VoiceCommandTarget,
  VoiceCommandType,
  VoiceInputSource,
  VoiceInputs,
  VoiceProfile,
} from "./voice-inputs.interface";
export type { VoiceOutput } from "./voice-output.interface";
export { freezeVoiceOutput, freezeVoiceProfile } from "./voice-output.interface";
export { normalizePhonemeSequence, normalizeVoiceText } from "./voice-normalizer";
export type { PhonemeMatch } from "./voice-phoneme-mapper";
export { mapVoicePhoneme } from "./voice-phoneme-mapper";
export {
  categoryForCommand,
  isPhonemeEntryEligible,
  isRoleAllowedForVoiceCommand,
  isRoleAllowedToSpeak,
  isVoiceProfileImmutable,
  targetForCategory,
} from "./voice-rules";
export {
  incomingEventFromVoiceFailed,
  incomingEventFromVoiceProcessed,
  incomingEventFromVoiceReceived,
  incomingEventFromVoiceTranslated,
} from "./voice-events";
