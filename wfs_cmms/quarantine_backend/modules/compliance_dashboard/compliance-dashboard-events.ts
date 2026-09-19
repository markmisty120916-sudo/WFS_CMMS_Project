export const COMPLIANCE_DASHBOARD_EVENT_TYPES = Object.freeze({
  compliance_triggered: "compliance.triggered",
  compliance_workorder_created: "compliance.workorder.created",
  compliance_approved: "compliance.approved",
  compliance_scheduled: "compliance.scheduled",
  compliance_assigned: "compliance.assigned",
  compliance_execution_completed: "compliance.execution.completed",
  compliance_qa_approved: "compliance.qa.approved",
  compliance_qa_failed: "compliance.qa.failed",
  compliance_closed: "compliance.closed",
  pm_compliance_failed: "pm.compliance.failed",
  pm_compliance_passed: "pm.compliance.passed",
  predictive_generated: "aimi.predictive.generated",
  predictive_updated: "aimi.predictive.updated",
  predictive_escalated: "aimi.predictive.escalated",
  insight_generated: "aimi.insight.generated",
  insight_updated: "aimi.insight.updated",
  voice_command_received: "voice.command.received",
  voice_command_processed: "voice.command.processed",
  voice_command_failed: "voice.command.failed",
  voice_command_translated: "voice.command.translated",
  voice_command_logged: "voice.command.logged",
});

export const COMPLIANCE_DASHBOARD_INSIGHT_TYPES: readonly string[] = Object.freeze([
  COMPLIANCE_DASHBOARD_EVENT_TYPES.predictive_generated,
  COMPLIANCE_DASHBOARD_EVENT_TYPES.predictive_updated,
  COMPLIANCE_DASHBOARD_EVENT_TYPES.predictive_escalated,
  COMPLIANCE_DASHBOARD_EVENT_TYPES.insight_generated,
  COMPLIANCE_DASHBOARD_EVENT_TYPES.insight_updated,
  COMPLIANCE_DASHBOARD_EVENT_TYPES.pm_compliance_failed,
  COMPLIANCE_DASHBOARD_EVENT_TYPES.compliance_qa_failed,
]);

export const COMPLIANCE_DASHBOARD_VOICE_TYPES: readonly string[] = Object.freeze([
  COMPLIANCE_DASHBOARD_EVENT_TYPES.voice_command_received,
  COMPLIANCE_DASHBOARD_EVENT_TYPES.voice_command_processed,
  COMPLIANCE_DASHBOARD_EVENT_TYPES.voice_command_failed,
  COMPLIANCE_DASHBOARD_EVENT_TYPES.voice_command_translated,
  COMPLIANCE_DASHBOARD_EVENT_TYPES.voice_command_logged,
]);
