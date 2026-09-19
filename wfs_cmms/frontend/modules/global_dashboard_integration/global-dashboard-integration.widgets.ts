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
  if (widget === "parts_predictions") {
    return "Parts Usage Predictions";
  }
  if (widget === "compliance_predictions") {
    return "Compliance Predictions";
  }
  return widget;
}
