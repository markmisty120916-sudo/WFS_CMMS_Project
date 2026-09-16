/**
 * AIMI Voice NLP Engine
 * Master Blueprint V2 / VOICE-COMMANDS §12 / multilingual.md §4
 * Deterministic phoneme and command-text normalize. Meaning is not rewritten.
 */

import { normalizeMultilingualText } from "../multilingual-nlp/multilingual-normalizer";

export function normalizeVoiceText(text: string): string {
  return normalizeMultilingualText(text);
}

export function normalizePhonemeSequence(sequence: string): string {
  return normalizeMultilingualText(sequence);
}
