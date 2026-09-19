export function isDriverPortalSafetyInsightType(event_type: string): boolean {
  if (event_type === "aimi.predictive.generated") {
    return true;
  }
  if (event_type === "aimi.predictive.updated") {
    return true;
  }
  if (event_type === "aimi.predictive.escalated") {
    return true;
  }
  if (event_type === "aimi.insight.generated") {
    return true;
  }
  if (event_type === "aimi.insight.updated") {
    return true;
  }
  if (event_type === "pm.compliance.failed") {
    return true;
  }
  if (event_type === "compliance.qa.failed") {
    return true;
  }
  if (event_type === "compliance.triggered") {
    return true;
  }
  return false;
}
