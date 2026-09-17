export const TECHNICIAN_EVENT_TYPES = Object.freeze({
  workorder_created: "workorder.created",
  workorder_updated: "workorder.updated",
  workorder_assigned: "workorder.assigned",
  workorder_started: "workorder.started",
  workorder_waiting_parts: "workorder.waiting_parts",
  workorder_on_hold: "workorder.on_hold",
  workorder_completed: "workorder.completed",
  workorder_closed: "workorder.closed",
  workorder_escalated: "workorder.escalated",
  diagnostic_started: "diagnostic.step.started",
  diagnostic_completed: "diagnostic.step.completed",
  diagnostic_skipped: "diagnostic.step.skipped",
  diagnostic_verified: "diagnostic.verification.completed",
  pm_started: "pm.started",
  pm_finding_logged: "pm.finding.logged",
  pm_completed: "pm.completed",
  pm_compliance_failed: "pm.compliance.failed",
  pm_compliance_passed: "pm.compliance.passed",
  voice_received: "voice.command.received",
  voice_processed: "voice.command.processed",
  voice_failed: "voice.command.failed",
  voice_translated: "voice.command.translated",
  voice_logged: "voice.command.logged",
  notification_generated: "notification.generated",
  notification_delivered: "notification.delivered",
  notification_acknowledged: "notification.acknowledged",
  notification_escalated: "notification.escalated",
  notification_resolved: "notification.resolved",
});

export const TECHNICIAN_EVENT_FEED_TYPES: readonly string[] = Object.freeze([
  TECHNICIAN_EVENT_TYPES.workorder_created,
  TECHNICIAN_EVENT_TYPES.workorder_updated,
  TECHNICIAN_EVENT_TYPES.workorder_assigned,
  TECHNICIAN_EVENT_TYPES.workorder_started,
  TECHNICIAN_EVENT_TYPES.workorder_waiting_parts,
  TECHNICIAN_EVENT_TYPES.workorder_on_hold,
  TECHNICIAN_EVENT_TYPES.workorder_completed,
  TECHNICIAN_EVENT_TYPES.workorder_closed,
  TECHNICIAN_EVENT_TYPES.workorder_escalated,
  TECHNICIAN_EVENT_TYPES.diagnostic_started,
  TECHNICIAN_EVENT_TYPES.diagnostic_completed,
  TECHNICIAN_EVENT_TYPES.diagnostic_skipped,
  TECHNICIAN_EVENT_TYPES.diagnostic_verified,
  TECHNICIAN_EVENT_TYPES.pm_started,
  TECHNICIAN_EVENT_TYPES.pm_finding_logged,
  TECHNICIAN_EVENT_TYPES.pm_completed,
  TECHNICIAN_EVENT_TYPES.pm_compliance_failed,
  TECHNICIAN_EVENT_TYPES.pm_compliance_passed,
  TECHNICIAN_EVENT_TYPES.voice_received,
  TECHNICIAN_EVENT_TYPES.voice_processed,
  TECHNICIAN_EVENT_TYPES.voice_failed,
  TECHNICIAN_EVENT_TYPES.voice_translated,
  TECHNICIAN_EVENT_TYPES.voice_logged,
  TECHNICIAN_EVENT_TYPES.notification_generated,
  TECHNICIAN_EVENT_TYPES.notification_delivered,
  TECHNICIAN_EVENT_TYPES.notification_acknowledged,
  TECHNICIAN_EVENT_TYPES.notification_escalated,
  TECHNICIAN_EVENT_TYPES.notification_resolved,
]);

export function isTechnicianEventType(event_type: string): boolean {
  let index = 0;
  while (index < TECHNICIAN_EVENT_FEED_TYPES.length) {
    if (TECHNICIAN_EVENT_FEED_TYPES[index] === event_type) {
      return true;
    }
    index = index + 1;
  }
  return false;
}
