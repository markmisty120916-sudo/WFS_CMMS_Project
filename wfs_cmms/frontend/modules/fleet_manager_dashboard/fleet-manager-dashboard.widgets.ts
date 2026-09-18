export function fleetManagerWidgetLabel(key: string): string {
  if (key === "health") {
    return "Fleet Health Overview";
  }
  if (key === "breakdowns") {
    return "Breakdown Queue";
  }
  if (key === "pm") {
    return "PM Compliance";
  }
  if (key === "inventory") {
    return "Inventory Impact";
  }
  if (key === "workload") {
    return "Technician Workload";
  }
  if (key === "find_vehicle") {
    return "Find Vehicle";
  }
  if (key === "quick_actions") {
    return "Asset Quick Actions";
  }
  if (key === "insights") {
    return "AIMI Insight Feed";
  }
  return key;
}
