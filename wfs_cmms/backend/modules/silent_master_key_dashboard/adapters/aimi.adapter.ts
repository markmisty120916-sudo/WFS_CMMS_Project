import {
  SILENT_MASTER_KEY_AIMI_TYPES,
  SILENT_MASTER_KEY_DIAGNOSTIC_TYPES,
  SILENT_MASTER_KEY_PREDICTIVE_TYPES,
} from "../silent-master-key-dashboard-events";

export function isSilentMasterKeyAimiType(event_type: string): boolean {
  let index = 0;
  while (index < SILENT_MASTER_KEY_AIMI_TYPES.length) {
    if (SILENT_MASTER_KEY_AIMI_TYPES[index] === event_type) {
      return true;
    }
    index = index + 1;
  }
  return false;
}

export function isSilentMasterKeyPredictiveType(event_type: string): boolean {
  let index = 0;
  while (index < SILENT_MASTER_KEY_PREDICTIVE_TYPES.length) {
    if (SILENT_MASTER_KEY_PREDICTIVE_TYPES[index] === event_type) {
      return true;
    }
    index = index + 1;
  }
  return false;
}

export function isSilentMasterKeyDiagnosticType(event_type: string): boolean {
  let index = 0;
  while (index < SILENT_MASTER_KEY_DIAGNOSTIC_TYPES.length) {
    if (SILENT_MASTER_KEY_DIAGNOSTIC_TYPES[index] === event_type) {
      return true;
    }
    index = index + 1;
  }
  return false;
}
