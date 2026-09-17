import type { ErrorType } from "../../../core/errors/error-types";
import { partsRequestTenantError } from "../parts-request-rules";
import {
  freezePartsRequest,
  freezePartsUsage,
  freezeWorkorderLink,
  type PartsRequest,
  type PartsRequestBuildResult,
  type PartsUsage,
  type WorkorderLink,
} from "../parts-request.interface";
import { asDeletedAt, asFieldString } from "./parts-request-normalizer";

function fail<T>(error_code: ErrorType): PartsRequestBuildResult<T> {
  return { success: false, error_code, value: null };
}

export function mapPartsRequestRow(
  tenant_id: string,
  row: Readonly<Record<string, unknown>>,
): PartsRequestBuildResult<PartsRequest> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = partsRequestTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const request_id = asFieldString(row.request_id);
  if (request_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezePartsRequest({
      tenant_id: record_tenant_id,
      request_id,
      workorder_id: asFieldString(row.workorder_id),
      part_id: asFieldString(row.part_id),
      quantity: asFieldString(row.quantity),
      status: asFieldString(row.status),
      created_at: asFieldString(row.created_at),
      updated_at: asFieldString(row.updated_at),
      deleted_at: asDeletedAt(row.deleted_at),
    }),
  };
}

export function mapPartsUsageRow(
  tenant_id: string,
  row: Readonly<Record<string, unknown>>,
): PartsRequestBuildResult<PartsUsage> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = partsRequestTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const part_usage_id = asFieldString(row.part_usage_id);
  if (part_usage_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezePartsUsage({
      tenant_id: record_tenant_id,
      part_usage_id,
      workorder_id: asFieldString(row.workorder_id),
      part_id: asFieldString(row.part_id),
      quantity: asFieldString(row.quantity),
      created_at: asFieldString(row.created_at),
      updated_at: asFieldString(row.updated_at),
      deleted_at: asDeletedAt(row.deleted_at),
    }),
  };
}

export function mapWorkorderLinkRow(
  tenant_id: string,
  row: Readonly<Record<string, unknown>>,
): PartsRequestBuildResult<WorkorderLink> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = partsRequestTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const workorder_id = asFieldString(row.workorder_id);
  if (workorder_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeWorkorderLink({
      tenant_id: record_tenant_id,
      workorder_id,
      asset_id: asFieldString(row.asset_id),
      source: asFieldString(row.source),
      severity: asFieldString(row.severity),
    }),
  };
}
