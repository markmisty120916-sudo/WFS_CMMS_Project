export function complianceDashboardWidgetLabel(key: string): string {
  if (key === "overview") {
    return "Inspection Overview";
  }
  if (key === "dvir") {
    return "DVIR Panel";
  }
  if (key === "safety") {
    return "Safety Workorders Queue";
  }
  if (key === "findings") {
    return "Compliance Findings Panel";
  }
  if (key === "dot") {
    return "DOT Compliance Panel";
  }
  if (key === "district") {
    return "School District Compliance Panel";
  }
  if (key === "multilingual") {
    return "Multilingual Compliance Panel";
  }
  if (key === "voice") {
    return "Voice Compliance Panel";
  }
  if (key === "insights") {
    return "AIMI Compliance Insights";
  }
  if (key === "feed") {
    return "AIMI Insight Feed";
  }
  return key;
}
