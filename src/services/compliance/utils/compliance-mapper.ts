import type { ErrorType } from "../../../core/errors/error-types";
import { complianceTenantError } from "../compliance-rules";
import {
  freezeDriverReport,
  freezeInspectionInstance,
  freezeInspectionTemplate,
  type ComplianceBuildResult,
  type DriverReport,
  type InspectionInstance,
  type InspectionTemplate,
} from "../compliance.interface";
import { asDeletedAt, asFieldString } from "./compliance-normalizer";

function fail<T>(error_code: ErrorType): ComplianceBuildResult<T> {
  return { success: false, error_code, value: null };
}

export function mapInspectionTemplateRow(
  tenant_id: string,
  row: Readonly<Record<string, unknown>>,
): ComplianceBuildResult<InspectionTemplate> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = complianceTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const inspection_id = asFieldString(row.inspection_id);
  if (inspection_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeInspectionTemplate({
      tenant_id: record_tenant_id,
      inspection_id,
      asset_id: asFieldString(row.asset_id),
      type: asFieldString(row.type),
      status: asFieldString(row.status),
      created_at: asFieldString(row.created_at),
      updated_at: asFieldString(row.updated_at),
      deleted_at: asDeletedAt(row.deleted_at),
    }),
  };
}

export function mapInspectionInstanceRow(
  tenant_id: string,
  row: Readonly<Record<string, unknown>>,
): ComplianceBuildResult<InspectionInstance> {
  const mapped = mapInspectionTemplateRow(tenant_id, row);
  if (mapped.success === false || mapped.value === null) {
    return fail(mapped.error_code);
  }
  return {
    success: true,
    error_code: "none",
    value: freezeInspectionInstance(mapped.value),
  };
}

export function mapDriverReportRow(
  tenant_id: string,
  row: Readonly<Record<string, unknown>>,
): ComplianceBuildResult<DriverReport> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = complianceTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const violation_id = asFieldString(row.violation_id);
  if (violation_id === "") {
    return fail("entity_id required");
  }
  const asset_id = asFieldString(row.asset_id);
  if (asset_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeDriverReport({
      tenant_id: record_tenant_id,
      violation_id,
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
