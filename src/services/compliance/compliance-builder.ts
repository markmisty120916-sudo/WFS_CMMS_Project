import { asRecord, asString } from "../../core/validation/dto.schema";
import { parseCompleteInspectionDto } from "./dto/complete-inspection.dto";
import { parseCreateInspectionInstanceDto } from "./dto/create-inspection-instance.dto";
import { parseCreateInspectionTemplateDto } from "./dto/create-inspection-template.dto";
import { parseDriverDefectReportDto } from "./dto/driver-defect-report.dto";
import { parseUpdateInspectionTemplateDto } from "./dto/update-inspection-template.dto";
import {
  freezeInspectionTemplate,
  type InspectionTemplate,
  type InspectionTemplateWriteInput,
} from "./compliance.interface";
import type { ErrorType } from "../../core/errors/error-types";
import type { ComplianceBuildResult } from "./compliance.interface";

export function failComplianceBuild<T>(error_code: ErrorType): ComplianceBuildResult<T> {
  return { success: false, error_code, value: null };
}

export function parseInspectionTemplateCreate(input: unknown) {
  return parseCreateInspectionTemplateDto(input);
}

export function parseInspectionTemplateUpdate(input: unknown) {
  return parseUpdateInspectionTemplateDto(input);
}

export function parseInspectionInstanceCreate(input: unknown) {
  return parseCreateInspectionInstanceDto(input);
}

export function parseInspectionComplete(input: unknown) {
  return parseCompleteInspectionDto(input);
}

export function parseDriverReport(input: unknown) {
  return parseDriverDefectReportDto(input);
}

export function parseInspectionListQuery(input: unknown): { asset_id: string; type: string } {
  if (input === undefined) {
    return { asset_id: "", type: "" };
  }
  const record = asRecord(input);
  if (record === null) {
    return { asset_id: "", type: "" };
  }
  return {
    asset_id: asString(record.asset_id),
    type: asString(record.type),
  };
}

export function applyTemplateWrite(
  tenant_id: string,
  inspection_id: string,
  timestamp: string,
  input: InspectionTemplateWriteInput,
  current: InspectionTemplate | null,
): ComplianceBuildResult<InspectionTemplate> {
  if (tenant_id === "") {
    return failComplianceBuild("tenant_id required");
  }
  if (inspection_id === "") {
    return failComplianceBuild("entity_id required");
  }
  if (timestamp === "") {
    return failComplianceBuild("timestamp required");
  }
  let created_at = timestamp;
  if (current !== null) {
    created_at = current.created_at;
  }
  return {
    success: true,
    error_code: "none",
    value: freezeInspectionTemplate({
      tenant_id,
      inspection_id,
      asset_id: "",
      type: input.type,
      status: "template",
      created_at,
      updated_at: timestamp,
      deleted_at: null,
    }),
  };
}

export function buildTemplateForSoftDelete(
  current: InspectionTemplate,
  timestamp: string,
): ComplianceBuildResult<InspectionTemplate> {
  if (timestamp === "") {
    return failComplianceBuild("timestamp required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeInspectionTemplate({
      tenant_id: current.tenant_id,
      inspection_id: current.inspection_id,
      asset_id: current.asset_id,
      type: current.type,
      status: current.status,
      created_at: current.created_at,
      updated_at: timestamp,
      deleted_at: timestamp,
    }),
  };
}
