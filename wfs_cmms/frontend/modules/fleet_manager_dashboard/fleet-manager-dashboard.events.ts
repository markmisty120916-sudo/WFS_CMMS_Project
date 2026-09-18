export const FLEET_MANAGER_EVENT_TYPES = Object.freeze({
  workorder_created: "workorder.created",
  workorder_waiting_parts: "workorder.waiting_parts",
  workorder_escalated: "workorder.escalated",
  predictive_generated: "aimi.predictive.generated",
  predictive_updated: "aimi.predictive.updated",
  predictive_escalated: "aimi.predictive.escalated",
  insight_generated: "aimi.insight.generated",
  insight_updated: "aimi.insight.updated",
  pm_compliance_failed: "pm.compliance.failed",
  inventory_request_submitted: "inventory.request.submitted",
});
