import { asRecord, asString } from "../../core/validation/dto.schema";
import { parseCreateDriverDefectDto } from "./dto/create-driver-defect.dto";
import { parseDriverDefectStatusDto } from "./dto/driver-defect-status.dto";
import { parseUpdateDriverDefectDto } from "./dto/update-driver-defect.dto";
import {
  freezeDriverDefect,
  type DriverDefect,
  type DriverDefectBuildResult,
  type DriverDefectWriteInput,
} from "./driver-defect.interface";
import type { ErrorType } from "../../core/errors/error-types";

export function failDriverDefectBuild<T>(error_code: ErrorType): DriverDefectBuildResult<T> {
  return { success: false, error_code, value: null };
}

export function parseDriverDefectCreate(input: unknown) {
  return parseCreateDriverDefectDto(input);
}

export function parseDriverDefectUpdate(input: unknown) {
  return parseUpdateDriverDefectDto(input);
}

export function parseDriverDefectStatus(input: unknown) {
  return parseDriverDefectStatusDto(input);
}

export function parseDriverDefectListQuery(input: unknown): { asset_id: string; status: string } {
  if (input === undefined) {
    return { asset_id: "", status: "" };
  }
  const record = asRecord(input);
  if (record === null) {
    return { asset_id: "", status: "" };
  }
  return {
    asset_id: asString(record.asset_id),
    status: asString(record.status),
  };
}

export function applyDriverDefectCreate(
  tenant_id: string,
  defect_id: string,
  timestamp: string,
  input: DriverDefectWriteInput,
): DriverDefectBuildResult<DriverDefect> {
  if (tenant_id === "") {
    return failDriverDefectBuild("tenant_id required");
  }
  if (defect_id === "") {
    return failDriverDefectBuild("entity_id required");
  }
  if (timestamp === "") {
    return failDriverDefectBuild("timestamp required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeDriverDefect({
      tenant_id,
      defect_id,
      asset_id: input.asset_id,
      description: input.description,
      severity: input.severity,
      status: "open",
      created_at: timestamp,
      updated_at: timestamp,
      deleted_at: null,
    }),
  };
}

export function applyDriverDefectSoftDelete(
  current: DriverDefect,
  timestamp: string,
): DriverDefectBuildResult<DriverDefect> {
  if (timestamp === "") {
    return failDriverDefectBuild("timestamp required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeDriverDefect({
      tenant_id: current.tenant_id,
      defect_id: current.defect_id,
      asset_id: current.asset_id,
      description: current.description,
      severity: current.severity,
      status: current.status,
      created_at: current.created_at,
      updated_at: timestamp,
      deleted_at: timestamp,
    }),
  };
}
