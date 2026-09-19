import { COMPLIANCE_DASHBOARD_INSIGHT_TYPES, COMPLIANCE_DASHBOARD_VOICE_TYPES } from "../compliance-dashboard-events";

export function isComplianceInsightEventType(event_type: string): boolean {
  let index = 0;
  while (index < COMPLIANCE_DASHBOARD_INSIGHT_TYPES.length) {
    if (COMPLIANCE_DASHBOARD_INSIGHT_TYPES[index] === event_type) {
      return true;
    }
    index = index + 1;
  }
  return false;
}

export function isComplianceVoiceEventType(event_type: string): boolean {
  let index = 0;
  while (index < COMPLIANCE_DASHBOARD_VOICE_TYPES.length) {
    if (COMPLIANCE_DASHBOARD_VOICE_TYPES[index] === event_type) {
      return true;
    }
    index = index + 1;
  }
  return false;
}

export function isComplianceMultilingualEventType(event_type: string): boolean {
  if (event_type === "voice.command.translated") {
    return true;
  }
  return false;
}
