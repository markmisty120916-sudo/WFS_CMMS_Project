export type MasterTechWidgetId =
  | "workorder_queue"
  | "aimi_severity"
  | "aimi_diagnostics"
  | "aimi_predictive"
  | "asset_health"
  | "pm_status"
  | "parts_status"
  | "compliance_status"
  | "voice_commands"
  | "multilingual"
  | "neon_hud"
  | "aimi_insight_feed"
  | "fleet_visualization";

export type MasterTechWidget = {
  readonly widget_id: MasterTechWidgetId;
  readonly label: string;
};

export const MASTER_TECH_WIDGETS: readonly MasterTechWidget[] = Object.freeze([
  Object.freeze({
    widget_id: "workorder_queue" as const,
    label: "Workorder Queue",
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
    widget_id: "pm_status" as const,
    label: "PM Status",
  }),
  Object.freeze({
    widget_id: "parts_status" as const,
    label: "Parts Status",
  }),
  Object.freeze({
    widget_id: "compliance_status" as const,
    label: "Compliance Status",
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
  Object.freeze({
    widget_id: "fleet_visualization" as const,
    label: "3D Fleet Visualization",
  }),
]);

export function masterTechWidgetLabel(widget_id: MasterTechWidgetId): string {
  let index = 0;
  while (index < MASTER_TECH_WIDGETS.length) {
    const widget = MASTER_TECH_WIDGETS[index];
    if (widget.widget_id === widget_id) {
      return widget.label;
    }
    index = index + 1;
  }
  return "";
}
