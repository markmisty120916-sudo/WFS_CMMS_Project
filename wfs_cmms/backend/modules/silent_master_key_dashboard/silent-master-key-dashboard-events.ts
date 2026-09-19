export const SILENT_MASTER_KEY_EVENT_TYPES = Object.freeze({
  workorder_escalated: "workorder.escalated",
  routing_overridden: "routing.overridden",
  scheduling_updated: "scheduling.updated",
  predictive_generated: "aimi.predictive.generated",
  predictive_updated: "aimi.predictive.updated",
  predictive_escalated: "aimi.predictive.escalated",
  insight_generated: "aimi.insight.generated",
  insight_updated: "aimi.insight.updated",
  insight_approved: "aimi.insight.approved",
  insight_applied: "aimi.insight.applied",
  diagnostic_step_started: "diagnostic.step.started",
  diagnostic_step_completed: "diagnostic.step.completed",
  diagnostic_step_skipped: "diagnostic.step.skipped",
  diagnostic_verification_completed: "diagnostic.verification.completed",
});

export const SILENT_MASTER_KEY_AIMI_TYPES: readonly string[] = Object.freeze([
  SILENT_MASTER_KEY_EVENT_TYPES.insight_generated,
  SILENT_MASTER_KEY_EVENT_TYPES.insight_updated,
  SILENT_MASTER_KEY_EVENT_TYPES.insight_approved,
  SILENT_MASTER_KEY_EVENT_TYPES.insight_applied,
  SILENT_MASTER_KEY_EVENT_TYPES.predictive_generated,
  SILENT_MASTER_KEY_EVENT_TYPES.predictive_updated,
  SILENT_MASTER_KEY_EVENT_TYPES.predictive_escalated,
]);

export const SILENT_MASTER_KEY_PREDICTIVE_TYPES: readonly string[] = Object.freeze([
  SILENT_MASTER_KEY_EVENT_TYPES.predictive_generated,
  SILENT_MASTER_KEY_EVENT_TYPES.predictive_updated,
  SILENT_MASTER_KEY_EVENT_TYPES.predictive_escalated,
]);

export const SILENT_MASTER_KEY_DIAGNOSTIC_TYPES: readonly string[] = Object.freeze([
  SILENT_MASTER_KEY_EVENT_TYPES.diagnostic_step_started,
  SILENT_MASTER_KEY_EVENT_TYPES.diagnostic_step_completed,
  SILENT_MASTER_KEY_EVENT_TYPES.diagnostic_step_skipped,
  SILENT_MASTER_KEY_EVENT_TYPES.diagnostic_verification_completed,
]);
