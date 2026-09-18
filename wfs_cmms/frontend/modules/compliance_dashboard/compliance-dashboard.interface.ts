import type { DtoRole } from "../../../../src/core/dto/base.dto";

export type ComplianceDashboardSession = {
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
  readonly token: string;
};

export type ComplianceDashboardFilter = {
  readonly asset: string;
  readonly inspection_type: string;
  readonly severity: string;
  readonly driver: string;
  readonly technician: string;
  readonly compliance_category: string;
};

export type ComplianceInspectionItem = {
  readonly tenant_id: string;
  readonly inspection_id: string;
  readonly asset_id: string;
  readonly type: string;
  readonly status: string;
  readonly created_at: string;
};

export type ComplianceOverview = {
  readonly tenant_id: string;
  readonly open_count: string;
  readonly overdue_count: string;
  readonly upcoming_count: string;
  readonly items: readonly ComplianceInspectionItem[];
};

export type ComplianceDvirItem = {
  readonly tenant_id: string;
  readonly violation_id: string;
  readonly asset_id: string;
  readonly description: string;
  readonly severity: string;
  readonly status: string;
  readonly created_at: string;
};

export type ComplianceSafetyWorkorderItem = {
  readonly tenant_id: string;
  readonly workorder_id: string;
  readonly asset_id: string;
  readonly description: string;
  readonly severity: string;
  readonly status: string;
  readonly routing_tech_id: string;
  readonly created_by: string;
};

export type ComplianceFindingItem = {
  readonly tenant_id: string;
  readonly inspection_id: string;
  readonly asset_id: string;
  readonly status: string;
  readonly severity: string;
  readonly repeat_offender: string;
};

export type ComplianceDotItem = {
  readonly tenant_id: string;
  readonly inspection_id: string;
  readonly asset_id: string;
  readonly type: string;
  readonly status: string;
};

export type ComplianceDistrictItem = {
  readonly tenant_id: string;
  readonly inspection_id: string;
  readonly asset_id: string;
  readonly type: string;
  readonly status: string;
};

export type ComplianceMultilingualItem = {
  readonly tenant_id: string;
  readonly event_id: string;
  readonly event_type: string;
  readonly asset_id: string;
  readonly timestamp: string;
};

export type ComplianceVoiceItem = {
  readonly tenant_id: string;
  readonly event_id: string;
  readonly event_type: string;
  readonly asset_id: string;
  readonly timestamp: string;
};

export type ComplianceAimiInsightItem = {
  readonly tenant_id: string;
  readonly event_id: string;
  readonly event_type: string;
  readonly asset_id: string;
  readonly workorder_id: string;
  readonly reason: string;
  readonly timestamp: string;
};
