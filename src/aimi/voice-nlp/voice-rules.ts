/**
 * AIMI Voice NLP Engine
 * Master Blueprint V2 / VOICE-COMMANDS §2–§14 / RBAC
 * Closed categories and role routing. Profiles are never rewritten.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type {
  PhonemeCatalogEntry,
  VoiceCommandCategory,
  VoiceCommandTarget,
  VoiceCommandType,
  VoiceProfile,
} from "./voice-inputs.interface";
import type { SupportedLanguage } from "../multilingual-nlp/multilingual-inputs.interface";

export function isRoleAllowedToSpeak(role: DtoRole): boolean {
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

export function targetForCategory(category: VoiceCommandCategory): VoiceCommandTarget {
  if (category === "Workorder Commands") {
    return "workorders";
  }
  if (category === "Diagnostic Commands") {
    return "diagnostics";
  }
  if (category === "Asset Commands") {
    return "assets";
  }
  if (category === "Scheduling Commands") {
    return "scheduling";
  }
  if (category === "PM Commands") {
    return "pm";
  }
  if (category === "Compliance Commands") {
    return "compliance";
  }
  if (category === "Navigation Commands") {
    return "ui";
  }
  return "aimi.core";
}

export function categoryForCommand(command_type: VoiceCommandType): VoiceCommandCategory {
  if (command_type === "Create a workorder for this bus.") {
    return "Workorder Commands";
  }
  if (command_type === "Add a note to this workorder.") {
    return "Workorder Commands";
  }
  if (command_type === "Add a photo to this workorder.") {
    return "Workorder Commands";
  }
  if (command_type === "Assign this to a technician.") {
    return "Workorder Commands";
  }
  if (command_type === "Close this workorder.") {
    return "Workorder Commands";
  }
  if (command_type === "Show recommended repair.") {
    return "Workorder Commands";
  }
  if (command_type === "Show verification steps.") {
    return "Workorder Commands";
  }
  if (command_type === "AIMI, diagnose this issue.") {
    return "Diagnostic Commands";
  }
  if (command_type === "Next step.") {
    return "Diagnostic Commands";
  }
  if (command_type === "Repeat step.") {
    return "Diagnostic Commands";
  }
  if (command_type === "Skip step.") {
    return "Diagnostic Commands";
  }
  if (command_type === "Explain this step.") {
    return "Diagnostic Commands";
  }
  if (command_type === "Show recommended parts.") {
    return "Diagnostic Commands";
  }
  if (command_type === "Show fault history.") {
    return "Diagnostic Commands";
  }
  if (command_type === "Show asset health.") {
    return "Asset Commands";
  }
  if (command_type === "Show telematics data.") {
    return "Asset Commands";
  }
  if (command_type === "Show predictive alerts.") {
    return "Asset Commands";
  }
  if (command_type === "Show PM schedule.") {
    return "Asset Commands";
  }
  if (command_type === "Show compliance status.") {
    return "Asset Commands";
  }
  if (command_type === "Schedule this repair.") {
    return "Scheduling Commands";
  }
  if (command_type === "Assign a bay.") {
    return "Scheduling Commands";
  }
  if (command_type === "Assign a technician.") {
    return "Scheduling Commands";
  }
  if (command_type === "Show availability.") {
    return "Scheduling Commands";
  }
  if (command_type === "Show scheduling window.") {
    return "Scheduling Commands";
  }
  if (command_type === "Start PM.") {
    return "PM Commands";
  }
  if (command_type === "Log PM findings.") {
    return "PM Commands";
  }
  if (command_type === "Complete PM.") {
    return "PM Commands";
  }
  if (command_type === "Show PM checklist.") {
    return "PM Commands";
  }
  if (command_type === "Start inspection.") {
    return "Compliance Commands";
  }
  if (command_type === "Log inspection findings.") {
    return "Compliance Commands";
  }
  if (command_type === "Complete inspection.") {
    return "Compliance Commands";
  }
  if (command_type === "Show compliance status.") {
    return "Compliance Commands";
  }
  if (command_type === "Go to workorders.") {
    return "Navigation Commands";
  }
  if (command_type === "Go to assets.") {
    return "Navigation Commands";
  }
  if (command_type === "Go to diagnostics.") {
    return "Navigation Commands";
  }
  if (command_type === "Go to scheduling.") {
    return "Navigation Commands";
  }
  if (command_type === "Go to PM.") {
    return "Navigation Commands";
  }
  if (command_type === "Go to compliance.") {
    return "Navigation Commands";
  }
  return "AIMI Commands";
}

export function isRoleAllowedForVoiceCommand(role: DtoRole, command_type: VoiceCommandType): boolean {
  if (role === "ADMIN") {
    return true;
  }
  if (role === "SILENT MASTER KEY") {
    return true;
  }
  const category = categoryForCommand(command_type);
  if (role === "TECHNICIAN") {
    if (category === "Scheduling Commands") {
      return false;
    }
    if (category === "Compliance Commands") {
      return false;
    }
    if (category === "AIMI Commands") {
      return false;
    }
    if (command_type === "Go to scheduling.") {
      return false;
    }
    if (command_type === "Go to compliance.") {
      return false;
    }
    return true;
  }
  if (role === "MASTER TECHNICIAN") {
    return true;
  }
  if (role === "FLEET MANAGER") {
    return true;
  }
  if (role === "DRIVER") {
    if (command_type === "Show asset health.") {
      return true;
    }
    if (command_type === "Go to assets.") {
      return true;
    }
    return false;
  }
  if (role === "PARTS MANAGER") {
    if (command_type === "Go to workorders.") {
      return true;
    }
    return false;
  }
  if (role === "COMPLIANCE OFFICER") {
    if (category === "Compliance Commands") {
      return true;
    }
    if (category === "PM Commands") {
      return true;
    }
    if (command_type === "Show PM schedule.") {
      return true;
    }
    if (command_type === "Show compliance status.") {
      return true;
    }
    if (command_type === "Go to compliance.") {
      return true;
    }
    if (command_type === "Go to PM.") {
      return true;
    }
    if (command_type === "Go to assets.") {
      return true;
    }
    return false;
  }
  return false;
}

export function isPhonemeEntryEligible(
  entry: PhonemeCatalogEntry,
  tenant_id: string,
  language: SupportedLanguage,
): boolean {
  if (entry.tenant_id !== tenant_id) {
    return false;
  }
  if (entry.language !== language) {
    return false;
  }
  if (entry.phoneme_sequence === "") {
    return false;
  }
  if (entry.source_token === "") {
    return false;
  }
  if (categoryForCommand(entry.command_type) !== entry.command_category) {
    return false;
  }
  if (targetForCategory(entry.command_category) !== entry.command_target) {
    return false;
  }
  return true;
}

export function isVoiceProfileImmutable(current: VoiceProfile, next: VoiceProfile): boolean {
  if (current.tenant_id !== next.tenant_id) {
    return false;
  }
  if (current.user_id !== next.user_id) {
    return false;
  }
  if (current.language !== next.language) {
    return false;
  }
  if (current.source !== next.source) {
    return false;
  }
  return true;
}
