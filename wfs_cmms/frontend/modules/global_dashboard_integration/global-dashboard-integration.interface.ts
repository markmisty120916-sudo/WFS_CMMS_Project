import type { DtoRole } from "../../../../src/core/dto/base.dto";

export type IntegrationDashboard =
  | "master_technician"
  | "technician"
  | "fleet_manager"
  | "parts_manager"
  | "compliance"
  | "driver"
  | "silent_master_key";

export type GlobalDashboardIntegrationSession = {
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
  readonly token: string;
};

export type GlobalDashboardIntegrationFilter = {
  readonly asset_id: string;
  readonly workorder_id: string;
  readonly severity: string;
  readonly status: string;
  readonly vendor_id: string;
  readonly page: string;
  readonly limit: string;
};

export type ConfigurationPackEffect = {
  readonly tenant_id: string;
  readonly pack_id: string;
  readonly name: string;
  readonly pm_template_name: string;
  readonly interval_miles: string;
  readonly interval_hours: string;
  readonly pm_interval: string;
  readonly severity_default: string;
  readonly severity_color: string;
  readonly workorder_source: string;
  readonly telematics_fault_code: string;
  readonly telematics_severity: string;
};

export type ImportHistoryReference = {
  readonly tenant_id: string;
  readonly import_id: string;
  readonly data_type: string;
  readonly file_format: string;
  readonly status: string;
  readonly created_by: string;
  readonly created_at: string;
};

export type IntegrationFindVehiclePoint = {
  readonly tenant_id: string;
  readonly asset_id: string;
  readonly unit_number: string;
  readonly telematics_id: string;
  readonly fault_code: string;
  readonly fault_description: string;
  readonly severity: string;
  readonly severity_color: string;
  readonly source: "gps" | "can" | "obd" | "breadcrumbs";
  readonly timestamp: string;
};

export type IntegrationTelematicsResult = {
  readonly tenant_id: string;
  readonly label: "Find Vehicle";
  readonly points: readonly IntegrationFindVehiclePoint[];
};

export type IntegrationAimiItem = {
  readonly tenant_id: string;
  readonly asset_id: string;
  readonly workorder_id: string;
  readonly insight_type: string;
  readonly insight_severity: string;
  readonly severity_color: string;
  readonly predictive_score: string;
  readonly failure_risk: string;
  readonly anomaly: string;
  readonly compliance_prediction: string;
  readonly parts_usage_prediction: string;
  readonly event_type: string;
  readonly timestamp: string;
};

export type IntegrationAssetItem = {
  readonly tenant_id: string;
  readonly asset_id: string;
  readonly unit_number: string;
  readonly status: string;
  readonly asset_state: string;
  readonly pack_effects: readonly ConfigurationPackEffect[];
  readonly import_history: readonly ImportHistoryReference[];
};

export type IntegrationInventoryItem = {
  readonly tenant_id: string;
  readonly part_id: string;
  readonly name: string;
  readonly quantity: string;
  readonly predictive_usage: string;
};

export type IntegrationComplianceItem = {
  readonly tenant_id: string;
  readonly inspection_id: string;
  readonly asset_id: string;
  readonly type: string;
  readonly status: string;
};
