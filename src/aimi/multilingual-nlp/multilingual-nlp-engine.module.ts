/**
 * AIMI Multilingual NLP Engine
 * Master Blueprint V2 / BACKEND-STRUCTURE §6 / multilingual.md §3
 * Factory only. No Nest runtime. No global multilingual instance.
 */

import {
  MultilingualNlpEngineService,
  type MultilingualNlpEngineServiceOptions,
} from "./multilingual-nlp-engine.service";

export class MultilingualNlpEngineModule {
  static create(options: MultilingualNlpEngineServiceOptions): MultilingualNlpEngineService {
    return new MultilingualNlpEngineService(options);
  }
}

export { MultilingualNlpEngineService } from "./multilingual-nlp-engine.service";
export type { MultilingualNlpEngineServiceOptions } from "./multilingual-nlp-engine.service";
export type {
  LanguageProfile,
  MultilingualCommandTarget,
  MultilingualCommandType,
  MultilingualInputs,
  MultilingualSource,
  SupportedLanguage,
  TranslationDictionaryEntry,
} from "./multilingual-inputs.interface";
export type { MultilingualOutput } from "./multilingual-output.interface";
export { freezeLanguageProfile, freezeMultilingualOutput } from "./multilingual-output.interface";
export { normalizeMultilingualText } from "./multilingual-normalizer";
export type { TokenMatch } from "./multilingual-token-mapper";
export { mapMultilingualToken } from "./multilingual-token-mapper";
export {
  SUPPORTED_LANGUAGES,
  isDictionaryEntryEligible,
  isLanguageProfileImmutable,
  isRoleAllowedToTranslate,
  isSupportedLanguage,
  targetForCommand,
} from "./multilingual-rules";
export {
  incomingEventFromMultilingualFailed,
  incomingEventFromMultilingualProcessed,
  incomingEventFromMultilingualTranslated,
} from "./multilingual-events";
