import type { DtoRole } from "../../../core/dto/base.dto";

export type MasterTechSession = {
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
  readonly token: string;
  readonly timestamp: string;
};

export type MasterTechLanguage =
  | "English"
  | "Spanish"
  | "French"
  | "German"
  | "Portuguese"
  | "Mandarin"
  | "Arabic";

export type MasterTechSeverity = "S1" | "S2" | "S3" | "S4" | "S5";

export type MasterTechFailureRisk = "Imminent" | "High" | "Medium" | "Low";

export type MasterTechWorkorder = {
  readonly tenant_id: string;
  readonly workorder_id: string;
  readonly asset_id: string;
  readonly source: string;
  readonly description: string;
  readonly severity: string;
  readonly routing_tech_id: string;
  readonly routing_bay_id: string;
  readonly scheduled_start: string;
  readonly scheduled_end: string;
  readonly predictive_risk: string;
  readonly pm_conflict: string;
  readonly status: string;
};

export type MasterTechSeverityFeedItem = {
  readonly tenant_id: string;
  readonly workorder_id: string;
  readonly asset_id: string;
  readonly severity: string;
  readonly reason: string;
  readonly timestamp: string;
};

export type MasterTechDiagnosticFeedItem = {
  readonly tenant_id: string;
  readonly workorder_id: string;
  readonly diagnostic_flow_id: string;
  readonly diagnostic_path: string;
  readonly current_step_id: string;
  readonly diagnostic_reason: string;
  readonly verification_complete: boolean;
  readonly timestamp: string;
};

export type MasterTechPredictiveAlert = {
  readonly tenant_id: string;
  readonly asset_id: string;
  readonly workorder_id: string;
  readonly predictive_score: string;
  readonly failure_risk: string;
  readonly predictive_reason: string;
  readonly timestamp: string;
};

export type MasterTechAssetHealthItem = {
  readonly tenant_id: string;
  readonly asset_id: string;
  readonly unit_number: string;
  readonly status: string;
  readonly health_score: string;
  readonly predictive_score: string;
  readonly last_update: string;
};

export type MasterTechPmStatusItem = {
  readonly tenant_id: string;
  readonly pm_schedule_id: string;
  readonly asset_id: string;
  readonly pm_template_id: string;
  readonly due_miles: string;
  readonly due_hours: string;
  readonly status: string;
};

export type MasterTechPartsStatusItem = {
  readonly tenant_id: string;
  readonly part_id: string;
  readonly name: string;
  readonly quantity: string;
  readonly location: string;
  readonly status: string;
};

export type MasterTechComplianceStatusItem = {
  readonly tenant_id: string;
  readonly inspection_id: string;
  readonly asset_id: string;
  readonly type: string;
  readonly status: string;
};

export type MasterTechInsightItem = {
  readonly tenant_id: string;
  readonly insight_id: string;
  readonly workorder_id: string;
  readonly asset_id: string;
  readonly insight_type: string;
  readonly reason: string;
  readonly timestamp: string;
};

export type MasterTechEventItem = {
  readonly tenant_id: string;
  readonly event_id: string;
  readonly event_type: string;
  readonly event_category: string;
  readonly timestamp: string;
};

export type MasterTechVoiceResult = {
  readonly tenant_id: string;
  readonly command_text: string;
  readonly language: MasterTechLanguage;
  readonly processed: boolean;
};

export type MasterTechTranslationResult = {
  readonly tenant_id: string;
  readonly source_language: MasterTechLanguage;
  readonly target_language: MasterTechLanguage;
  readonly original_text: string;
  readonly translated_text: string;
};

export type MasterTechQueueFilter = {
  readonly status: string;
  readonly asset_id: string;
  readonly severity: string;
};

export type MasterTechHudState = {
  readonly enabled: boolean;
  readonly voice_enabled: boolean;
  readonly multilingual_enabled: boolean;
  readonly language: MasterTechLanguage;
};
