export function partsManagerWidgetLabel(key: string): string {
  if (key === "inventory") {
    return "Inventory Overview";
  }
  if (key === "awaiting") {
    return "Awaiting Parts Queue";
  }
  if (key === "vendors") {
    return "Vendor Management Panel";
  }
  if (key === "usage") {
    return "Part Usage History";
  }
  if (key === "predictive") {
    return "Predictive Parts Insights";
  }
  if (key === "alerts") {
    return "Inventory Alerts";
  }
  if (key === "quick_actions") {
    return "Part Quick Actions";
  }
  if (key === "insights") {
    return "AIMI Insight Feed";
  }
  return key;
}
