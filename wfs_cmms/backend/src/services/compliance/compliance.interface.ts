import type { DtoRole } from "../../core/dto/base.dto";
import type { ErrorType } from "../../core/errors/error-types";
import type { PredictiveOutput } from "../../aimi/predictive/predictive-output.interface";
import type { SeverityOutput } from "../../aimi/severity/severity-output.interface";

export type ComplianceBuildResult<T> =
  | { success: true; error_code: "none"; value: T }
  | { success: false; error_code: ErrorType; value: null };

export type InspectionTemplate = {
  readonly tenant_id: string;
  readonly inspection_id: string;
  readonly asset_id: string;
  readonly type: string;
  readonly status: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type InspectionInstance = {
  readonly tenant_id: string;
  readonly inspection_id: string;
  readonly asset_id: string;
  readonly type: string;
  readonly status: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type InspectionChecklist = {
  readonly tenant_id: string;
  readonly inspection_id: string;
  readonly type: string;
  readonly items: readonly string[];
  readonly voice_enabled: boolean;
  readonly multilingual_enabled: boolean;
};

export type InspectionResult = {
  readonly tenant_id: string;
  readonly inspection_id: string;
  readonly asset_id: string;
  readonly findings: string;
  readonly result: string;
};

export type DriverReport = {
  readonly tenant_id: string;
  readonly violation_id: string;
  readonly asset_id: string;
  readonly description: string;
  readonly severity: string;
  readonly status: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type InspectionTemplateWriteInput = {
  readonly type: string;
  readonly frequency: string;
  readonly severity_default: string;
  readonly voice_enabled: boolean;
  readonly multilingual_enabled: boolean;
};

export type InspectionInstanceWriteInput = {
  readonly asset_id: string;
  readonly type: string;
};

export type InspectionCompleteInput = {
  readonly findings: string;
  readonly result: string;
};

export type DriverDefectReportInput = {
  readonly asset_id: string;
  readonly description: string;
  readonly severity: string;
};

export type InspectionListQuery = {
  readonly asset_id: string;
  readonly type: string;
};

export type InspectionTemplateListResult = {
  readonly tenant_id: string;
  readonly role: DtoRole;
  readonly templates: readonly InspectionTemplate[];
};

export type InspectionListResult = {
  readonly tenant_id: string;
  readonly role: DtoRole;
  readonly inspections: readonly InspectionInstance[];
};

export type InspectionCompletion = {
  readonly tenant_id: string;
  readonly inspection: InspectionInstance;
  readonly checklist: InspectionChecklist;
  readonly result: InspectionResult;
  readonly severity: SeverityOutput | null;
  readonly predictive: PredictiveOutput | null;
};

export type DriverReportResult = {
  readonly tenant_id: string;
  readonly report: DriverReport;
  readonly severity: SeverityOutput | null;
  readonly predictive: PredictiveOutput | null;
};

export function freezeInspectionTemplate(row: InspectionTemplate): InspectionTemplate {
  return Object.freeze({
    tenant_id: row.tenant_id,
    inspection_id: row.inspection_id,
    asset_id: row.asset_id,
    type: row.type,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  });
}

export function freezeInspectionInstance(row: InspectionInstance): InspectionInstance {
  return Object.freeze({
    tenant_id: row.tenant_id,
    inspection_id: row.inspection_id,
    asset_id: row.asset_id,
    type: row.type,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  });
}

export function freezeInspectionChecklist(row: InspectionChecklist): InspectionChecklist {
  const items: string[] = [];
  let index = 0;
  while (index < row.items.length) {
    items.push(row.items[index]);
    index = index + 1;
  }
  return Object.freeze({
    tenant_id: row.tenant_id,
    inspection_id: row.inspection_id,
    type: row.type,
    items: Object.freeze(items),
    voice_enabled: row.voice_enabled,
    multilingual_enabled: row.multilingual_enabled,
  });
}

export function freezeInspectionResult(row: InspectionResult): InspectionResult {
  return Object.freeze({
    tenant_id: row.tenant_id,
    inspection_id: row.inspection_id,
    asset_id: row.asset_id,
    findings: row.findings,
    result: row.result,
  });
}

export function freezeDriverReport(row: DriverReport): DriverReport {
  return Object.freeze({
    tenant_id: row.tenant_id,
    violation_id: row.violation_id,
    asset_id: row.asset_id,
    description: row.description,
    severity: row.severity,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  });
}

export function freezeInspectionTemplateListResult(
  result: InspectionTemplateListResult,
): InspectionTemplateListResult {
  const templates: InspectionTemplate[] = [];
  let index = 0;
  while (index < result.templates.length) {
    templates.push(result.templates[index]);
    index = index + 1;
  }
  return Object.freeze({
    tenant_id: result.tenant_id,
    role: result.role,
    templates: Object.freeze(templates),
  });
}

export function freezeInspectionListResult(result: InspectionListResult): InspectionListResult {
  const inspections: InspectionInstance[] = [];
  let index = 0;
  while (index < result.inspections.length) {
    inspections.push(result.inspections[index]);
    index = index + 1;
  }
  return Object.freeze({
    tenant_id: result.tenant_id,
    role: result.role,
    inspections: Object.freeze(inspections),
  });
}

export function freezeInspectionCompletion(row: InspectionCompletion): InspectionCompletion {
  return Object.freeze({
    tenant_id: row.tenant_id,
    inspection: row.inspection,
    checklist: row.checklist,
    result: row.result,
    severity: row.severity,
    predictive: row.predictive,
  });
}

export function freezeDriverReportResult(row: DriverReportResult): DriverReportResult {
  return Object.freeze({
    tenant_id: row.tenant_id,
    report: row.report,
    severity: row.severity,
    predictive: row.predictive,
  });
}
