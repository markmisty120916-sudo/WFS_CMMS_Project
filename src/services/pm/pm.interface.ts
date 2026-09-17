import type { DtoRole } from "../../core/dto/base.dto";
import type { ErrorType } from "../../core/errors/error-types";
import type { PredictiveOutput } from "../../aimi/predictive/predictive-output.interface";
import type { SeverityOutput } from "../../aimi/severity/severity-output.interface";

export type PmBuildResult<T> =
  | { success: true; error_code: "none"; value: T }
  | { success: false; error_code: ErrorType; value: null };

export type PmTemplate = {
  readonly tenant_id: string;
  readonly pm_template_id: string;
  readonly name: string;
  readonly interval_miles: string;
  readonly interval_hours: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type PmSchedule = {
  readonly tenant_id: string;
  readonly pm_schedule_id: string;
  readonly asset_id: string;
  readonly pm_template_id: string;
  readonly due_miles: string;
  readonly due_hours: string;
  readonly status: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type PmHistory = {
  readonly tenant_id: string;
  readonly pm_history_id: string;
  readonly asset_id: string;
  readonly pm_template_id: string;
  readonly completed_at: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type PmFinding = {
  readonly tenant_id: string;
  readonly pm_schedule_id: string;
  readonly asset_id: string;
  readonly findings: string;
  readonly technician_id: string;
};

export type PmTrigger = {
  readonly tenant_id: string;
  readonly pm_schedule_id: string;
  readonly asset_id: string;
  readonly miles_due: boolean;
  readonly hours_due: boolean;
  readonly telematics_due: boolean;
  readonly fired: boolean;
};

export type PmTemplateWriteInput = {
  readonly name: string;
  readonly interval_miles: string;
  readonly interval_hours: string;
  readonly asset_group: string;
  readonly severity_default: string;
};

export type PmInstanceWriteInput = {
  readonly asset_id: string;
  readonly pm_template_id: string;
  readonly due_miles: string;
  readonly due_hours: string;
};

export type PmCompleteInput = {
  readonly findings: string;
  readonly technician_id: string;
};

export type PmScheduleQuery = {
  readonly asset_id: string;
};

export type PmTemplateListResult = {
  readonly tenant_id: string;
  readonly role: DtoRole;
  readonly templates: readonly PmTemplate[];
};

export type PmScheduleListResult = {
  readonly tenant_id: string;
  readonly role: DtoRole;
  readonly schedules: readonly PmSchedule[];
};

export type PmCompletion = {
  readonly tenant_id: string;
  readonly schedule: PmSchedule;
  readonly history: PmHistory;
  readonly finding: PmFinding;
  readonly severity: SeverityOutput | null;
  readonly predictive: PredictiveOutput | null;
};

export function freezePmTemplate(row: PmTemplate): PmTemplate {
  return Object.freeze({
    tenant_id: row.tenant_id,
    pm_template_id: row.pm_template_id,
    name: row.name,
    interval_miles: row.interval_miles,
    interval_hours: row.interval_hours,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  });
}

export function freezePmSchedule(row: PmSchedule): PmSchedule {
  return Object.freeze({
    tenant_id: row.tenant_id,
    pm_schedule_id: row.pm_schedule_id,
    asset_id: row.asset_id,
    pm_template_id: row.pm_template_id,
    due_miles: row.due_miles,
    due_hours: row.due_hours,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  });
}

export function freezePmHistory(row: PmHistory): PmHistory {
  return Object.freeze({
    tenant_id: row.tenant_id,
    pm_history_id: row.pm_history_id,
    asset_id: row.asset_id,
    pm_template_id: row.pm_template_id,
    completed_at: row.completed_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  });
}

export function freezePmFinding(row: PmFinding): PmFinding {
  return Object.freeze({
    tenant_id: row.tenant_id,
    pm_schedule_id: row.pm_schedule_id,
    asset_id: row.asset_id,
    findings: row.findings,
    technician_id: row.technician_id,
  });
}

export function freezePmTrigger(row: PmTrigger): PmTrigger {
  return Object.freeze({
    tenant_id: row.tenant_id,
    pm_schedule_id: row.pm_schedule_id,
    asset_id: row.asset_id,
    miles_due: row.miles_due,
    hours_due: row.hours_due,
    telematics_due: row.telematics_due,
    fired: row.fired,
  });
}

export function freezePmTemplateListResult(result: PmTemplateListResult): PmTemplateListResult {
  const templates: PmTemplate[] = [];
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

export function freezePmScheduleListResult(result: PmScheduleListResult): PmScheduleListResult {
  const schedules: PmSchedule[] = [];
  let index = 0;
  while (index < result.schedules.length) {
    schedules.push(result.schedules[index]);
    index = index + 1;
  }
  return Object.freeze({
    tenant_id: result.tenant_id,
    role: result.role,
    schedules: Object.freeze(schedules),
  });
}

export function freezePmCompletion(row: PmCompletion): PmCompletion {
  return Object.freeze({
    tenant_id: row.tenant_id,
    schedule: row.schedule,
    history: row.history,
    finding: row.finding,
    severity: row.severity,
    predictive: row.predictive,
  });
}
