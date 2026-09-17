export type TechnicianWidgetId =
  | "my_workorders"
  | "assigned_tasks"
  | "aimi_severity"
  | "aimi_diagnostics"
  | "aimi_predictive"
  | "asset_health"
  | "pm_upcoming"
  | "parts_needed"
  | "compliance_flags"
  | "voice_commands"
  | "multilingual"
  | "neon_hud"
  | "aimi_insight_feed";

export type TechnicianWidget = {
  readonly widget_id: TechnicianWidgetId;
  readonly label: string;
};

export const TECHNICIAN_WIDGETS: readonly TechnicianWidget[] = Object.freeze([
  Object.freeze({
    widget_id: "my_workorders" as const,
    label: "Assigned Workorders",
  }),
  Object.freeze({
    widget_id: "assigned_tasks" as const,
    label: "Assigned Tasks",
  }),
  Object.freeze({
    widget_id: "aimi_severity" as const,
    label: "Severity Feed",
  }),
  Object.freeze({
    widget_id: "aimi_diagnostics" as const,
    label: "Diagnostic Feed",
  }),
  Object.freeze({
    widget_id: "aimi_predictive" as const,
    label: "Predictive Alerts",
  }),
  Object.freeze({
    widget_id: "asset_health" as const,
    label: "Asset Health",
  }),
  Object.freeze({
    widget_id: "pm_upcoming" as const,
    label: "Upcoming PM",
  }),
  Object.freeze({
    widget_id: "parts_needed" as const,
    label: "Parts Needed",
  }),
  Object.freeze({
    widget_id: "compliance_flags" as const,
    label: "Compliance Flags",
  }),
  Object.freeze({
    widget_id: "voice_commands" as const,
    label: "Voice Commands",
  }),
  Object.freeze({
    widget_id: "multilingual" as const,
    label: "Multilingual Support",
  }),
  Object.freeze({
    widget_id: "neon_hud" as const,
    label: "HUD Mode",
  }),
  Object.freeze({
    widget_id: "aimi_insight_feed" as const,
    label: "AIMI Insight Feed",
  }),
]);

export function technicianWidgetLabel(widget_id: TechnicianWidgetId): string {
  let index = 0;
  while (index < TECHNICIAN_WIDGETS.length) {
    const widget = TECHNICIAN_WIDGETS[index];
    if (widget.widget_id === widget_id) {
      return widget.label;
    }
    index = index + 1;
  }
  return "";
}
