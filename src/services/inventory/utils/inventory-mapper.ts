import type { ErrorType } from "../../../core/errors/error-types";
import { inventoryTenantError } from "../inventory-rules";
import {
  freezePart,
  freezePartRequest,
  freezePartUsage,
  type InventoryBuildResult,
  type Part,
  type PartRequest,
  type PartUsage,
} from "../inventory.interface";
import { asDeletedAt, asFieldString } from "./inventory-normalizer";

function fail<T>(error_code: ErrorType): InventoryBuildResult<T> {
  return { success: false, error_code, value: null };
}

export function mapPartRow(
  tenant_id: string,
  row: Readonly<Record<string, unknown>>,
): InventoryBuildResult<Part> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = inventoryTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const part_id = asFieldString(row.part_id);
  if (part_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezePart({
      tenant_id: record_tenant_id,
      part_id,
      name: asFieldString(row.name),
      description: asFieldString(row.description),
      quantity: asFieldString(row.quantity),
      location: asFieldString(row.location),
      created_at: asFieldString(row.created_at),
      updated_at: asFieldString(row.updated_at),
      deleted_at: asDeletedAt(row.deleted_at),
    }),
  };
}

export function mapPartRequestRow(
  tenant_id: string,
  row: Readonly<Record<string, unknown>>,
): InventoryBuildResult<PartRequest> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = inventoryTenantError(tenant_id, record_tenant_id);
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
    value: freezePartRequest({
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

export function mapPartUsageRow(
  tenant_id: string,
  row: Readonly<Record<string, unknown>>,
): InventoryBuildResult<PartUsage> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = inventoryTenantError(tenant_id, record_tenant_id);
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
    value: freezePartUsage({
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
