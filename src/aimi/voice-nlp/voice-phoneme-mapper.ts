/**
 * AIMI Voice NLP Engine
 * Master Blueprint V2 / VOICE-COMMANDS §12–§13
 * First matching tenant-and-language phoneme sequence. No guessed speech.
 */

import type { SupportedLanguage } from "../multilingual-nlp/multilingual-inputs.interface";
import type { PhonemeCatalogEntry } from "./voice-inputs.interface";
import { normalizePhonemeSequence } from "./voice-normalizer";
import { isPhonemeEntryEligible } from "./voice-rules";

export type PhonemeMatch = {
  readonly entry: PhonemeCatalogEntry;
};

export function mapVoicePhoneme(
  normalized_phonemes: string,
  tenant_id: string,
  language: SupportedLanguage,
  catalog: readonly PhonemeCatalogEntry[],
): PhonemeMatch | null {
  if (normalized_phonemes === "") {
    return null;
  }
  let index = 0;
  while (index < catalog.length) {
    const entry = catalog[index];
    index = index + 1;
    if (isPhonemeEntryEligible(entry, tenant_id, language) === false) {
      continue;
    }
    if (normalizePhonemeSequence(entry.phoneme_sequence) !== normalized_phonemes) {
      continue;
    }
    return { entry };
  }
  return null;
}
