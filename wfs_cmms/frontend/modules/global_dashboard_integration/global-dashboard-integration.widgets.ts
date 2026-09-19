export function integrationWidgetLabel(widget: string): string {
  if (widget === "find_vehicle") {
    return "Find Vehicle";
  }
  if (widget === "aimi") {
    return "AIMI Insights";
  }
  if (widget === "packs") {
    return "Configuration Pack Effects";
  }
  if (widget === "imports") {
    return "Import History";
  }
  if (widget === "imports_readonly") {
    return "Read-only";
  }
  if (widget === "parts_predictions") {
    return "Parts Usage Predictions";
  }
  if (widget === "compliance_predictions") {
    return "Compliance Predictions";
  }
  if (widget === "loading") {
    return "Loading";
  }
  if (widget === "empty") {
    return "No records";
  }
  if (widget === "error") {
    return "Unavailable";
  }
  if (widget === "previous") {
    return "Previous";
  }
  if (widget === "next") {
    return "Next";
  }
  if (widget === "maintenance") {
    return "Maintenance";
  }
  if (widget === "maintenance_body") {
    return "System is in maintenance mode";
  }
  return widget;
}

export function integrationStatusLabel(status: string): string {
  return status.trim().toLowerCase().split(" ").join("_").split("-").join("_").split("_").join(" ").toUpperCase();
}
