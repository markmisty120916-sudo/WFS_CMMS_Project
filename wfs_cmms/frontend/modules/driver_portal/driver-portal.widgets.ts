export function driverPortalWidgetLabel(key: string): string {
  if (key === "safety") {
    return "Safety Alerts Panel";
  }
  if (key === "asset") {
    return "Asset Status Panel";
  }
  if (key === "defect") {
    return "Defect Reporting Panel";
  }
  if (key === "pm") {
    return "PM Status Panel";
  }
  if (key === "compliance") {
    return "Compliance Status Panel";
  }
  if (key === "telematics") {
    return "Telematics Fault Summary";
  }
  if (key === "workorders") {
    return "Workorder Visibility";
  }
  return key;
}
