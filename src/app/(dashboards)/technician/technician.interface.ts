import type { DtoRole } from "../../../core/dto/base.dto";

export type TechnicianSession = {
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
  readonly token: string;
  readonly timestamp: string;
};

export type TechnicianLanguage =
  | "English"
  | "Spanish"
  | "French"
  | "German"
  | "Portuguese"
  | "Mandarin"
  | "Arabic";

export type TechnicianWorkorder = {
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

export type TechnicianTask = {
  readonly tenant_id: string;
  readonly workorder_id: string;
  readonly asset_id: string;
  readonly routing_tech_id: string;
  readonly routing_bay_id: string;
  readonly scheduled_start: string;
  readonly scheduled_end: string;
  readonly severity: string;
  readonly predictive_risk: string;
  readonly status: string;
};

export type TechnicianSeverityFeedItem = {
  readonly tenant_id: string;
  readonly workorder_id: string;
  readonly asset_id: string;
  readonly severity: string;
  readonly reason: string;
  readonly timestamp: string;
};

export type TechnicianDiagnosticFeedItem = {
  readonly tenant_id: string;
  readonly workorder_id: string;
  readonly diagnostic_flow_id: string;
  readonly diagnostic_path: string;
  readonly current_step_id: string;
  readonly diagnostic_reason: string;
  readonly verification_complete: boolean;
  readonly timestamp: string;
};

export type TechnicianPredictiveAlert = {
  readonly tenant_id: string;
  readonly asset_id: string;
  readonly workorder_id: string;
  readonly predictive_score: string;
  readonly failure_risk: string;
  readonly predictive_reason: string;
  readonly timestamp: string;
};

export type TechnicianInsightItem = {
  readonly tenant_id: string;
  readonly insight_id: string;
  readonly workorder_id: string;
  readonly asset_id: string;
  readonly insight_type: string;
  readonly reason: string;
  readonly timestamp: string;
};

export type TechnicianAssetHealthItem = {
  readonly tenant_id: string;
  readonly asset_id: string;
  readonly unit_number: string;
  readonly make: string;
  readonly model: string;
  readonly year: string;
  readonly mileage: string;
  readonly hours: string;
  readonly status: string;
  readonly health_score: string;
  readonly predictive_score: string;
  readonly last_update: string;
};

export type TechnicianPmUpcomingItem = {
  readonly tenant_id: string;
  readonly pm_schedule_id: string;
  readonly asset_id: string;
  readonly pm_template_id: string;
  readonly due_miles: string;
  readonly due_hours: string;
  readonly status: string;
};

export type TechnicianPartsNeededItem = {
  readonly tenant_id: string;
  readonly request_id: string;
  readonly workorder_id: string;
  readonly part_id: string;
  readonly quantity: string;
  readonly status: string;
};

export type TechnicianComplianceFlag = {
  readonly tenant_id: string;
  readonly workorder_id: string;
  readonly asset_id: string;
  readonly flag_type: string;
  readonly status: string;
  readonly timestamp: string;
};

export type TechnicianEventItem = {
  readonly tenant_id: string;
  readonly event_id: string;
  readonly event_type: string;
  readonly event_category: string;
  readonly timestamp: string;
};

export type TechnicianVoiceResult = {
  readonly tenant_id: string;
  readonly command_text: string;
  readonly language: TechnicianLanguage;
  readonly processed: boolean;
};

export type TechnicianTranslationResult = {
  readonly tenant_id: string;
  readonly source_language: TechnicianLanguage;
  readonly target_language: TechnicianLanguage;
  readonly original_text: string;
  readonly translated_text: string;
};

export type TechnicianQueueFilter = {
  readonly status: string;
  readonly asset_id: string;
  readonly severity: string;
};

export type TechnicianHudState = {
  readonly enabled: boolean;
  readonly voice_enabled: boolean;
  readonly multilingual_enabled: boolean;
  readonly language: TechnicianLanguage;
};
