import type { ErrorType } from "../../../core/errors/error-types";
import { assetTenantError } from "../assets-rules";
import {
  freezeAsset,
  freezeAssetDiagnostic,
  freezeAssetHealth,
  freezeAssetPmHistory,
  freezeAssetPmSchedule,
  freezeAssetTelematics,
  freezeAssetWorkorder,
  type Asset,
  type AssetBuildResult,
  type AssetDiagnostic,
  type AssetHealth,
  type AssetPmHistory,
  type AssetPmSchedule,
  type AssetTelematics,
  type AssetWorkorder,
} from "../assets.interface";
import { asDeletedAt, asFieldString } from "./asset-normalizer";

function fail<T>(error_code: ErrorType): AssetBuildResult<T> {
  return { success: false, error_code, value: null };
}

export function mapAssetRow(
  tenant_id: string,
  row: Readonly<Record<string, unknown>>,
): AssetBuildResult<Asset> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = assetTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const asset_id = asFieldString(row.asset_id);
  if (asset_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeAsset({
      tenant_id: record_tenant_id,
      asset_id,
      vin: asFieldString(row.vin),
      unit_number: asFieldString(row.unit_number),
      make: asFieldString(row.make),
      model: asFieldString(row.model),
      year: asFieldString(row.year),
      mileage: asFieldString(row.mileage),
      hours: asFieldString(row.hours),
      status: asFieldString(row.status),
      created_at: asFieldString(row.created_at),
      updated_at: asFieldString(row.updated_at),
      deleted_at: asDeletedAt(row.deleted_at),
    }),
  };
}

export function mapAssetHealthRow(
  tenant_id: string,
  asset_id: string,
  row: Readonly<Record<string, unknown>>,
): AssetBuildResult<AssetHealth> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = assetTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const record_asset_id = asFieldString(row.asset_id);
  if (record_asset_id !== asset_id) {
    return fail("entity_id mismatch");
  }
  const health_id = asFieldString(row.health_id);
  if (health_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeAssetHealth({
      tenant_id: record_tenant_id,
      health_id,
      asset_id: record_asset_id,
      health_score: asFieldString(row.health_score),
      predictive_score: asFieldString(row.predictive_score),
      last_update: asFieldString(row.last_update),
      created_at: asFieldString(row.created_at),
      updated_at: asFieldString(row.updated_at),
      deleted_at: asDeletedAt(row.deleted_at),
    }),
  };
}

export function mapAssetTelematicsRow(
  tenant_id: string,
  asset_id: string,
  row: Readonly<Record<string, unknown>>,
): AssetBuildResult<AssetTelematics> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = assetTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const record_asset_id = asFieldString(row.asset_id);
  if (record_asset_id !== asset_id) {
    return fail("entity_id mismatch");
  }
  const telematics_id = asFieldString(row.telematics_id);
  if (telematics_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeAssetTelematics({
      tenant_id: record_tenant_id,
      telematics_id,
      asset_id: record_asset_id,
      fault_code: asFieldString(row.fault_code),
      fault_description: asFieldString(row.fault_description),
      severity: asFieldString(row.severity),
      timestamp: asFieldString(row.timestamp),
      created_at: asFieldString(row.created_at),
      updated_at: asFieldString(row.updated_at),
      deleted_at: asDeletedAt(row.deleted_at),
    }),
  };
}

export function mapAssetPmScheduleRow(
  tenant_id: string,
  asset_id: string,
  row: Readonly<Record<string, unknown>>,
): AssetBuildResult<AssetPmSchedule> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = assetTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const record_asset_id = asFieldString(row.asset_id);
  if (record_asset_id !== asset_id) {
    return fail("entity_id mismatch");
  }
  const pm_schedule_id = asFieldString(row.pm_schedule_id);
  if (pm_schedule_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeAssetPmSchedule({
      tenant_id: record_tenant_id,
      pm_schedule_id,
      asset_id: record_asset_id,
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

export function mapAssetPmHistoryRow(
  tenant_id: string,
  asset_id: string,
  row: Readonly<Record<string, unknown>>,
): AssetBuildResult<AssetPmHistory> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = assetTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const record_asset_id = asFieldString(row.asset_id);
  if (record_asset_id !== asset_id) {
    return fail("entity_id mismatch");
  }
  const pm_history_id = asFieldString(row.pm_history_id);
  if (pm_history_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeAssetPmHistory({
      tenant_id: record_tenant_id,
      pm_history_id,
      asset_id: record_asset_id,
      pm_template_id: asFieldString(row.pm_template_id),
      completed_at: asFieldString(row.completed_at),
      created_at: asFieldString(row.created_at),
      updated_at: asFieldString(row.updated_at),
      deleted_at: asDeletedAt(row.deleted_at),
    }),
  };
}

export function mapAssetWorkorderRow(
  tenant_id: string,
  asset_id: string,
  row: Readonly<Record<string, unknown>>,
): AssetBuildResult<AssetWorkorder> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = assetTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const record_asset_id = asFieldString(row.asset_id);
  if (record_asset_id !== asset_id) {
    return fail("entity_id mismatch");
  }
  const workorder_id = asFieldString(row.workorder_id);
  if (workorder_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeAssetWorkorder({
      tenant_id: record_tenant_id,
      workorder_id,
      asset_id: record_asset_id,
      source: asFieldString(row.source),
      description: asFieldString(row.description),
      severity: asFieldString(row.severity),
      routing_tech_id: asFieldString(row.routing_tech_id),
      routing_bay_id: asFieldString(row.routing_bay_id),
      scheduled_start: asFieldString(row.scheduled_start),
      scheduled_end: asFieldString(row.scheduled_end),
      status: asFieldString(row.status),
      created_by: asFieldString(row.created_by),
      created_at: asFieldString(row.created_at),
      updated_at: asFieldString(row.updated_at),
      deleted_at: asDeletedAt(row.deleted_at),
    }),
  };
}

export function mapAssetDiagnosticRow(
  tenant_id: string,
  asset_id: string,
  row: Readonly<Record<string, unknown>>,
): AssetBuildResult<AssetDiagnostic> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = assetTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const record_asset_id = asFieldString(row.asset_id);
  if (record_asset_id !== asset_id) {
    return fail("entity_id mismatch");
  }
  const diagnostic_id = asFieldString(row.diagnostic_id);
  if (diagnostic_id === "") {
    return fail("entity_id required");
  }
  const workorder_id = asFieldString(row.workorder_id);
  if (workorder_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeAssetDiagnostic({
      tenant_id: record_tenant_id,
      diagnostic_id,
      workorder_id,
      asset_id: record_asset_id,
      steps_taken: asFieldString(row.steps_taken),
      steps_skipped: asFieldString(row.steps_skipped),
      outcome: asFieldString(row.outcome),
      created_at: asFieldString(row.created_at),
      updated_at: asFieldString(row.updated_at),
      deleted_at: asDeletedAt(row.deleted_at),
    }),
  };
}
