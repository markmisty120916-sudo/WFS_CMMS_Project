/**
 * AIMI Multilingual NLP Engine
 * Master Blueprint V2 / multilingual.md §4–§5
 * First matching tenant-and-language dictionary token. No guessed language.
 */

import type {
  SupportedLanguage,
  TranslationDictionaryEntry,
} from "./multilingual-inputs.interface";
import { normalizeMultilingualText } from "./multilingual-normalizer";
import { isDictionaryEntryEligible } from "./multilingual-rules";

export type TokenMatch = {
  readonly entry: TranslationDictionaryEntry;
};

export function mapMultilingualToken(
  normalized_text: string,
  tenant_id: string,
  language: SupportedLanguage,
  dictionary: readonly TranslationDictionaryEntry[],
): TokenMatch | null {
  if (normalized_text === "") {
    return null;
  }
  let index = 0;
  while (index < dictionary.length) {
    const entry = dictionary[index];
    index = index + 1;
    if (isDictionaryEntryEligible(entry, tenant_id, language) === false) {
      continue;
    }
    if (normalizeMultilingualText(entry.source_token) !== normalized_text) {
      continue;
    }
    return { entry };
  }
  return null;
}
