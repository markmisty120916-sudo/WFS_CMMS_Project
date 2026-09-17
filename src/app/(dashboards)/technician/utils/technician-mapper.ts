import type {
  TechnicianAssetHealthItem,
  TechnicianComplianceFlag,
  TechnicianDiagnosticFeedItem,
  TechnicianEventItem,
  TechnicianInsightItem,
  TechnicianLanguage,
  TechnicianPartsNeededItem,
  TechnicianPmUpcomingItem,
  TechnicianPredictiveAlert,
  TechnicianSeverityFeedItem,
  TechnicianTask,
  TechnicianTranslationResult,
  TechnicianVoiceResult,
  TechnicianWorkorder,
} from "../technician.interface";
import { asDataRecord, isTechnicianLanguage, readBooleanField, readStringField } from "./technician-normalizer";

export function mapWorkorder(value: unknown, tenant_id: string): TechnicianWorkorder | null {
  const record = asDataRecord(value);
  if (record === null) {
    return null;
  }
  const record_tenant_id = readStringField(record, ["tenant_id"]);
  if (record_tenant_id !== tenant_id) {
    return null;
  }
  const workorder_id = readStringField(record, ["workorder_id", "id"]);
  if (workorder_id === "") {
    return null;
  }
  return Object.freeze({
    tenant_id: record_tenant_id,
    workorder_id,
    asset_id: readStringField(record, ["asset_id"]),
    source: readStringField(record, ["source"]),
    description: readStringField(record, ["description"]),
    severity: readStringField(record, ["severity"]),
    routing_tech_id: readStringField(record, ["routing_tech_id", "assigned_to", "technician_id"]),
    routing_bay_id: readStringField(record, ["routing_bay_id", "bay_id"]),
    scheduled_start: readStringField(record, ["scheduled_start"]),
    scheduled_end: readStringField(record, ["scheduled_end"]),
    predictive_risk: readStringField(record, ["predictive_risk", "failure_risk"]),
    pm_conflict: readStringField(record, ["pm_conflict"]),
    status: readStringField(record, ["status"]),
  });
}

export function mapTask(workorder: TechnicianWorkorder): TechnicianTask {
  return Object.freeze({
    tenant_id: workorder.tenant_id,
    workorder_id: workorder.workorder_id,
    asset_id: workorder.asset_id,
    routing_tech_id: workorder.routing_tech_id,
    routing_bay_id: workorder.routing_bay_id,
    scheduled_start: workorder.scheduled_start,
    scheduled_end: workorder.scheduled_end,
    severity: workorder.severity,
    predictive_risk: workorder.predictive_risk,
    status: workorder.status,
  });
}

export function mapSeverityFeedItem(value: unknown, tenant_id: string, workorder_id: string, asset_id: string): TechnicianSeverityFeedItem | null {
  const record = asDataRecord(value);
  if (record === null) {
    return null;
  }
  const record_tenant_id = readStringField(record, ["tenant_id"]);
  if (record_tenant_id !== tenant_id) {
    return null;
  }
  const severity = readStringField(record, ["severity"]);
  if (severity === "") {
    return null;
  }
  return Object.freeze({
    tenant_id: record_tenant_id,
    workorder_id: readStringField(record, ["workorder_id"]) || workorder_id,
    asset_id: readStringField(record, ["asset_id"]) || asset_id,
    severity,
    reason: readStringField(record, ["reason"]),
    timestamp: readStringField(record, ["timestamp"]),
  });
}

export function mapDiagnosticFeedItem(value: unknown, tenant_id: string, workorder_id: string): TechnicianDiagnosticFeedItem | null {
  const record = asDataRecord(value);
  if (record === null) {
    return null;
  }
  const nested = asDataRecord(record.event_payload);
  const source = nested === null ? record : { ...record, ...nested };
  const record_tenant_id = readStringField(record, ["tenant_id"]) || readStringField(source, ["tenant_id"]);
  if (record_tenant_id !== tenant_id) {
    return null;
  }
  const diagnostic_flow_id = readStringField(source, ["diagnostic_flow_id", "event_id"]);
  if (diagnostic_flow_id === "") {
    return null;
  }
  return Object.freeze({
    tenant_id: record_tenant_id,
    workorder_id: readStringField(source, ["workorder_id"]) || workorder_id,
    diagnostic_flow_id,
    diagnostic_path: readStringField(source, ["diagnostic_path"]),
    current_step_id: readStringField(source, ["current_step_id"]),
    diagnostic_reason: readStringField(source, ["diagnostic_reason"]),
    verification_complete: readBooleanField(source, ["verification_complete"]),
    timestamp: readStringField(source, ["diagnostic_timestamp", "timestamp"]),
  });
}

export function mapPredictiveFromWorkorder(workorder: TechnicianWorkorder): TechnicianPredictiveAlert | null {
  if (workorder.predictive_risk === "") {
    return null;
  }
  return Object.freeze({
    tenant_id: workorder.tenant_id,
    asset_id: workorder.asset_id,
    workorder_id: workorder.workorder_id,
    predictive_score: "",
    failure_risk: workorder.predictive_risk,
    predictive_reason: workorder.pm_conflict,
    timestamp: workorder.scheduled_start,
  });
}

export function mapPredictiveAlert(value: unknown, tenant_id: string): TechnicianPredictiveAlert | null {
  const record = asDataRecord(value);
  if (record === null) {
    return null;
  }
  const record_tenant_id = readStringField(record, ["tenant_id"]);
  if (record_tenant_id !== tenant_id) {
    return null;
  }
  const asset_id = readStringField(record, ["asset_id"]);
  if (asset_id === "") {
    return null;
  }
  const score = record.predictive_score;
  let predictive_score = "";
  if (typeof score === "number") {
    predictive_score = String(score);
  } else {
    predictive_score = readStringField(record, ["predictive_score"]);
  }
  return Object.freeze({
    tenant_id: record_tenant_id,
    asset_id,
    workorder_id: readStringField(record, ["workorder_id"]),
    predictive_score,
    failure_risk: readStringField(record, ["failure_risk", "predictive_risk"]),
    predictive_reason: readStringField(record, ["predictive_reason", "reason"]),
    timestamp: readStringField(record, ["predictive_timestamp", "timestamp"]),
  });
}

export function mapAssetHealth(value: unknown, tenant_id: string): TechnicianAssetHealthItem | null {
  const record = asDataRecord(value);
  if (record === null) {
    return null;
  }
  const record_tenant_id = readStringField(record, ["tenant_id"]);
  if (record_tenant_id !== tenant_id) {
    return null;
  }
  const asset_id = readStringField(record, ["asset_id", "id"]);
  if (asset_id === "") {
    return null;
  }
  return Object.freeze({
    tenant_id: record_tenant_id,
    asset_id,
    unit_number: readStringField(record, ["unit_number", "asset_number"]),
    make: readStringField(record, ["make"]),
    model: readStringField(record, ["model"]),
    year: readStringField(record, ["year"]),
    mileage: readStringField(record, ["mileage"]),
    hours: readStringField(record, ["hours"]),
    status: readStringField(record, ["status"]),
    health_score: readStringField(record, ["health_score"]),
    predictive_score: readStringField(record, ["predictive_score"]),
    last_update: readStringField(record, ["last_update", "updated_at"]),
  });
}

export function mapPmUpcoming(value: unknown, tenant_id: string): TechnicianPmUpcomingItem | null {
  const record = asDataRecord(value);
  if (record === null) {
    return null;
  }
  const record_tenant_id = readStringField(record, ["tenant_id"]);
  if (record_tenant_id !== tenant_id) {
    return null;
  }
  const pm_schedule_id = readStringField(record, ["pm_schedule_id", "id"]);
  if (pm_schedule_id === "") {
    return null;
  }
  return Object.freeze({
    tenant_id: record_tenant_id,
    pm_schedule_id,
    asset_id: readStringField(record, ["asset_id"]),
    pm_template_id: readStringField(record, ["pm_template_id"]),
    due_miles: readStringField(record, ["due_miles"]),
    due_hours: readStringField(record, ["due_hours"]),
    status: readStringField(record, ["status"]),
  });
}

export function mapPartsNeeded(value: unknown, tenant_id: string, workorder_id: string): TechnicianPartsNeededItem | null {
  const record = asDataRecord(value);
  if (record === null) {
    return null;
  }
  const record_tenant_id = readStringField(record, ["tenant_id"]);
  if (record_tenant_id !== tenant_id) {
    return null;
  }
  const request_id = readStringField(record, ["request_id", "id"]);
  if (request_id === "") {
    return null;
  }
  return Object.freeze({
    tenant_id: record_tenant_id,
    request_id,
    workorder_id: readStringField(record, ["workorder_id"]) || workorder_id,
    part_id: readStringField(record, ["part_id"]),
    quantity: readStringField(record, ["quantity"]),
    status: readStringField(record, ["status"]),
  });
}

export function mapComplianceFlagFromWorkorder(workorder: TechnicianWorkorder): TechnicianComplianceFlag | null {
  if (workorder.pm_conflict === "") {
    return null;
  }
  return Object.freeze({
    tenant_id: workorder.tenant_id,
    workorder_id: workorder.workorder_id,
    asset_id: workorder.asset_id,
    flag_type: "pm.conflict",
    status: workorder.pm_conflict,
    timestamp: workorder.scheduled_start,
  });
}

export function mapComplianceFlagFromEvent(value: unknown, tenant_id: string): TechnicianComplianceFlag | null {
  const record = asDataRecord(value);
  if (record === null) {
    return null;
  }
  const nested = asDataRecord(record.event_payload);
  const source = nested === null ? record : { ...record, ...nested };
  const record_tenant_id = readStringField(record, ["tenant_id"]) || readStringField(source, ["tenant_id"]);
  if (record_tenant_id !== tenant_id) {
    return null;
  }
  const workorder_id = readStringField(source, ["workorder_id"]);
  if (workorder_id === "") {
    return null;
  }
  return Object.freeze({
    tenant_id: record_tenant_id,
    workorder_id,
    asset_id: readStringField(source, ["asset_id"]),
    flag_type: readStringField(record, ["event_type"]) || "pm.compliance.failed",
    status: readStringField(source, ["status"]) || "flagged",
    timestamp: readStringField(record, ["timestamp"]),
  });
}

export function mapInsight(value: unknown, tenant_id: string): TechnicianInsightItem | null {
  const record = asDataRecord(value);
  if (record === null) {
    return null;
  }
  const record_tenant_id = readStringField(record, ["tenant_id"]);
  if (record_tenant_id !== tenant_id) {
    return null;
  }
  const insight_id = readStringField(record, ["insight_id", "id", "event_id"]);
  if (insight_id === "") {
    return null;
  }
  return Object.freeze({
    tenant_id: record_tenant_id,
    insight_id,
    workorder_id: readStringField(record, ["workorder_id"]),
    asset_id: readStringField(record, ["asset_id"]),
    insight_type: readStringField(record, ["insight_type", "event_type", "type"]),
    reason: readStringField(record, ["reason", "predictive_reason", "diagnostic_reason"]),
    timestamp: readStringField(record, ["timestamp"]),
  });
}

export function mapEventItem(value: unknown, tenant_id: string): TechnicianEventItem | null {
  const record = asDataRecord(value);
  if (record === null) {
    return null;
  }
  const record_tenant_id = readStringField(record, ["tenant_id"]);
  if (record_tenant_id !== tenant_id) {
    return null;
  }
  const event_id = readStringField(record, ["event_id", "id"]);
  if (event_id === "") {
    return null;
  }
  return Object.freeze({
    tenant_id: record_tenant_id,
    event_id,
    event_type: readStringField(record, ["event_type"]),
    event_category: readStringField(record, ["event_category"]),
    timestamp: readStringField(record, ["timestamp"]),
  });
}

export function mapVoiceResult(value: unknown, tenant_id: string, command_text: string, language: TechnicianLanguage): TechnicianVoiceResult | null {
  const record = asDataRecord(value);
  if (record === null) {
    return Object.freeze({
      tenant_id,
      command_text,
      language,
      processed: false,
    });
  }
  const record_tenant_id = readStringField(record, ["tenant_id"]);
  if (record_tenant_id !== "" && record_tenant_id !== tenant_id) {
    return null;
  }
  return Object.freeze({
    tenant_id,
    command_text: readStringField(record, ["command_text"]) || command_text,
    language,
    processed: true,
  });
}

export function mapTranslationResult(
  value: unknown,
  tenant_id: string,
  source_language: TechnicianLanguage,
  target_language: TechnicianLanguage,
  original_text: string,
): TechnicianTranslationResult | null {
  const record = asDataRecord(value);
  if (record === null) {
    return null;
  }
  const record_tenant_id = readStringField(record, ["tenant_id"]);
  if (record_tenant_id !== "" && record_tenant_id !== tenant_id) {
    return null;
  }
  const detected = readStringField(record, ["source_language"]);
  let source: TechnicianLanguage = source_language;
  if (isTechnicianLanguage(detected) === true) {
    source = detected;
  }
  return Object.freeze({
    tenant_id,
    source_language: source,
    target_language,
    original_text,
    translated_text: readStringField(record, ["translated_text", "text"]) || original_text,
  });
}
