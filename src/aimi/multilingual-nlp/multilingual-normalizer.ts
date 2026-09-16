/**
 * AIMI Multilingual NLP Engine
 * Master Blueprint V2 / multilingual.md §4
 * Deterministic text normalize. Meaning is not rewritten.
 */

export function normalizeMultilingualText(text: string): string {
  let result = "";
  let index = 0;
  let pending_space = false;
  let started = false;
  while (index < text.length) {
    const character = text.charAt(index);
    index = index + 1;
    const lowered = character.toLowerCase();
    if (lowered === " ") {
      if (started === true) {
        pending_space = true;
      }
      continue;
    }
    if (pending_space === true) {
      result = result + " ";
      pending_space = false;
    }
    result = result + lowered;
    started = true;
  }
  return result;
}
