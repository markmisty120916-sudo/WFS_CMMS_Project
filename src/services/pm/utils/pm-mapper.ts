import type { ErrorType } from "../../../core/errors/error-types";
import { pmTenantError } from "../pm-rules";
import {
  freezePmHistory,
  freezePmSchedule,
  freezePmTemplate,
  type PmBuildResult,
  type PmHistory,
  type PmSchedule,
  type PmTemplate,
} from "../pm.interface";
import { asDeletedAt, asFieldString } from "./pm-normalizer";

function fail<T>(error_code: ErrorType): PmBuildResult<T> {
  return { success: false, error_code, value: null };
}

export function mapPmTemplateRow(
  tenant_id: string,
  row: Readonly<Record<string, unknown>>,
): PmBuildResult<PmTemplate> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = pmTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const pm_template_id = asFieldString(row.pm_template_id);
  if (pm_template_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezePmTemplate({
      tenant_id: record_tenant_id,
      pm_template_id,
      name: asFieldString(row.name),
      interval_miles: asFieldString(row.interval_miles),
      interval_hours: asFieldString(row.interval_hours),
      created_at: asFieldString(row.created_at),
      updated_at: asFieldString(row.updated_at),
      deleted_at: asDeletedAt(row.deleted_at),
    }),
  };
}

export function mapPmScheduleRow(
  tenant_id: string,
  row: Readonly<Record<string, unknown>>,
): PmBuildResult<PmSchedule> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = pmTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const pm_schedule_id = asFieldString(row.pm_schedule_id);
  if (pm_schedule_id === "") {
    return fail("entity_id required");
  }
  const asset_id = asFieldString(row.asset_id);
  if (asset_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezePmSchedule({
      tenant_id: record_tenant_id,
      pm_schedule_id,
      asset_id,
      pm_template_id: asFieldString(row.pm_template_id),
      due_miles: asFieldString(row.due_miles),
      due_hours: asFieldString(row.due_hours),
      status: asFieldString(row.status),
      created_at: asFieldString(row.created_at),
      updated_at: asFieldString(row.updated_at),
      deleted_at: asDeletedAt(row.deleted_at),
    }),
  };
}

export function mapPmHistoryRow(
  tenant_id: string,
  row: Readonly<Record<string, unknown>>,
): PmBuildResult<PmHistory> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = pmTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const pm_history_id = asFieldString(row.pm_history_id);
  if (pm_history_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezePmHistory({
      tenant_id: record_tenant_id,
      pm_history_id,
      asset_id: asFieldString(row.asset_id),
      pm_template_id: asFieldString(row.pm_template_id),
      completed_at: asFieldString(row.completed_at),
      created_at: asFieldString(row.created_at),
      updated_at: asFieldString(row.updated_at),
      deleted_at: asDeletedAt(row.deleted_at),
    }),
  };
}
