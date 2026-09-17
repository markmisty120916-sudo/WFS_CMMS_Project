import type { ErrorType } from "../../../core/errors/error-types";
import { driverDefectTenantError } from "../driver-defect-rules";
import {
  freezeDriverDefect,
  freezeDriverDefectPhoto,
  type DriverDefect,
  type DriverDefectBuildResult,
  type DriverDefectPhoto,
} from "../driver-defect.interface";
import { asDeletedAt, asFieldString } from "./driver-defect-normalizer";

function fail<T>(error_code: ErrorType): DriverDefectBuildResult<T> {
  return { success: false, error_code, value: null };
}

export function mapDriverDefectRow(
  tenant_id: string,
  row: Readonly<Record<string, unknown>>,
): DriverDefectBuildResult<DriverDefect> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = driverDefectTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const defect_id = asFieldString(row.violation_id);
  if (defect_id === "") {
    return fail("entity_id required");
  }
  const asset_id = asFieldString(row.asset_id);
  if (asset_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeDriverDefect({
      tenant_id: record_tenant_id,
      defect_id,
      asset_id,
      description: asFieldString(row.description),
      severity: asFieldString(row.severity),
      status: asFieldString(row.status),
      created_at: asFieldString(row.created_at),
      updated_at: asFieldString(row.updated_at),
      deleted_at: asDeletedAt(row.deleted_at),
    }),
  };
}

export function mapDriverDefectPhotoRow(
  tenant_id: string,
  row: Readonly<Record<string, unknown>>,
): DriverDefectBuildResult<DriverDefectPhoto> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = driverDefectTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const photo_id = asFieldString(row.photo_id);
  if (photo_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeDriverDefectPhoto({
      tenant_id: record_tenant_id,
      photo_id,
      workorder_id: asFieldString(row.workorder_id),
      user_id: asFieldString(row.user_id),
      photo_url: asFieldString(row.photo_url),
      created_at: asFieldString(row.created_at),
      updated_at: asFieldString(row.updated_at),
      deleted_at: asDeletedAt(row.deleted_at),
    }),
  };
}
