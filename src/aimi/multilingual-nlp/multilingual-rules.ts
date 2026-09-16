/**
 * AIMI Multilingual NLP Engine
 * Master Blueprint V2 / multilingual.md §2 / §4 / RBAC
 * Closed languages and command catalog. Profiles are never rewritten.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type {
  LanguageProfile,
  MultilingualCommandTarget,
  MultilingualCommandType,
  TranslationDictionaryEntry,
} from "./multilingual-inputs.interface";
import type { SupportedLanguage } from "./multilingual-inputs.interface";

export const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = Object.freeze([
  "English",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Mandarin",
  "Arabic",
]);

export function isSupportedLanguage(language: string): boolean {
  let index = 0;
  while (index < SUPPORTED_LANGUAGES.length) {
    if (SUPPORTED_LANGUAGES[index] === language) {
      return true;
    }
    index = index + 1;
  }
  return false;
}

export function isRoleAllowedToTranslate(role: DtoRole): boolean {
  if (role === "DRIVER") {
    return true;
  }
  if (role === "TECHNICIAN") {
    return true;
  }
  if (role === "MASTER TECHNICIAN") {
    return true;
  }
  if (role === "PARTS MANAGER") {
    return true;
  }
  if (role === "FLEET MANAGER") {
    return true;
  }
  if (role === "COMPLIANCE OFFICER") {
    return true;
  }
  if (role === "ADMIN") {
    return true;
  }
  if (role === "SILENT MASTER KEY") {
    return true;
  }
  return false;
}

export function targetForCommand(command_type: MultilingualCommandType): MultilingualCommandTarget {
  if (command_type === "Next step") {
    return "diagnostic";
  }
  if (command_type === "Repeat step") {
    return "diagnostic";
  }
  if (command_type === "Skip step") {
    return "diagnostic";
  }
  if (command_type === "Explain step") {
    return "diagnostic";
  }
  if (command_type === "Add note") {
    return "workorder";
  }
  if (command_type === "Add photo") {
    return "workorder";
  }
  if (command_type === "Request part") {
    return "inventory";
  }
  if (command_type === "Show verification") {
    return "verification";
  }
  if (command_type === "Show severity") {
    return "severity";
  }
  if (command_type === "Show routing") {
    return "routing";
  }
  return "scheduling";
}

export function isDictionaryEntryEligible(
  entry: TranslationDictionaryEntry,
  tenant_id: string,
  language: SupportedLanguage,
): boolean {
  if (entry.tenant_id !== tenant_id) {
    return false;
  }
  if (entry.language !== language) {
    return false;
  }
  if (entry.source_token === "") {
    return false;
  }
  if (entry.internal_token === "") {
    return false;
  }
  if (entry.command_target !== targetForCommand(entry.command_type)) {
    return false;
  }
  return true;
}

export function isLanguageProfileImmutable(current: LanguageProfile, next: LanguageProfile): boolean {
  if (current.tenant_id !== next.tenant_id) {
    return false;
  }
  if (current.user_id !== next.user_id) {
    return false;
  }
  if (current.language !== next.language) {
    return false;
  }
  return true;
}
