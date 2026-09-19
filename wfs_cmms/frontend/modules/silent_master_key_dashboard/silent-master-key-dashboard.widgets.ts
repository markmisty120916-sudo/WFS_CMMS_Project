export function silentMasterKeyWidgetLabel(key: string): string {
  if (key === "switch") {
    return "Dashboard Switching";
  }
  if (key === "aimi") {
    return "AIMI Visibility";
  }
  if (key === "predictive") {
    return "Predictive Visibility";
  }
  if (key === "diagnostics") {
    return "Diagnostic Visibility";
  }
  if (key === "severity") {
    return "Severity Override";
  }
  if (key === "routing") {
    return "Routing Override";
  }
  if (key === "scheduling") {
    return "Scheduling Override";
  }
  return key;
}
