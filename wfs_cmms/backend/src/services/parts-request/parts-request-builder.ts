import type { ErrorType } from "../../core/errors/error-types";
import { parseApprovePartsRequestDto } from "./dto/approve-parts-request.dto";
import { parseCreatePartsRequestDto } from "./dto/create-parts-request.dto";
import { parseDenyPartsRequestDto } from "./dto/deny-parts-request.dto";
import { parsePartsRequestStatusDto } from "./dto/parts-request-status.dto";
import { parseUpdatePartsRequestDto } from "./dto/update-parts-request.dto";
import {
  freezePartsRequest,
  type PartsRequest,
  type PartsRequestBuildResult,
  type PartsRequestWriteInput,
} from "./parts-request.interface";
import { asRecord, asString } from "../../core/validation/dto.schema";

export function failPartsRequestBuild<T>(error_code: ErrorType): PartsRequestBuildResult<T> {
  return { success: false, error_code, value: null };
}

export function parsePartsRequestCreate(input: unknown) {
  return parseCreatePartsRequestDto(input);
}

export function parsePartsRequestUpdate(input: unknown) {
  return parseUpdatePartsRequestDto(input);
}

export function parsePartsRequestApprove(input: unknown) {
  return parseApprovePartsRequestDto(input);
}

export function parsePartsRequestDeny(input: unknown) {
  return parseDenyPartsRequestDto(input);
}

export function parsePartsRequestStatus(input: unknown) {
  return parsePartsRequestStatusDto(input);
}

export function parsePartsRequestListQuery(input: unknown): {
  workorder_id: string;
  part_id: string;
  status: string;
} {
  if (input === undefined) {
    return { workorder_id: "", part_id: "", status: "" };
  }
  const record = asRecord(input);
  if (record === null) {
    return { workorder_id: "", part_id: "", status: "" };
  }
  return {
    workorder_id: asString(record.workorder_id),
    part_id: asString(record.part_id),
    status: asString(record.status),
  };
}

export function applyPartsRequestCreate(
  tenant_id: string,
  request_id: string,
  timestamp: string,
  input: PartsRequestWriteInput,
): PartsRequestBuildResult<PartsRequest> {
  if (tenant_id === "") {
    return failPartsRequestBuild("tenant_id required");
  }
  if (request_id === "") {
    return failPartsRequestBuild("entity_id required");
  }
  if (timestamp === "") {
    return failPartsRequestBuild("timestamp required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezePartsRequest({
      tenant_id,
      request_id,
      workorder_id: input.workorder_id,
      part_id: input.part_id,
      quantity: input.quantity,
      status: "submitted",
      created_at: timestamp,
      updated_at: timestamp,
      deleted_at: null,
    }),
  };
}

export function applyPartsRequestSoftDelete(
  current: PartsRequest,
  timestamp: string,
): PartsRequestBuildResult<PartsRequest> {
  if (timestamp === "") {
    return failPartsRequestBuild("timestamp required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezePartsRequest({
      tenant_id: current.tenant_id,
      request_id: current.request_id,
      workorder_id: current.workorder_id,
      part_id: current.part_id,
      quantity: current.quantity,
      status: current.status,
      created_at: current.created_at,
      updated_at: timestamp,
      deleted_at: timestamp,
    }),
  };
}
