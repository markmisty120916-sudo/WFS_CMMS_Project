import type { ErrorType } from "../../core/errors/error-types";
import { parseCompletePmDto } from "./dto/complete-pm.dto";
import { parseCreatePmInstanceDto } from "./dto/create-pm-instance.dto";
import { parseCreatePmTemplateDto } from "./dto/create-pm-template.dto";
import { parseUpdatePmTemplateDto } from "./dto/update-pm-template.dto";
import {
  freezePmSchedule,
  freezePmTemplate,
  type PmBuildResult,
  type PmSchedule,
  type PmTemplate,
  type PmTemplateWriteInput,
} from "./pm.interface";
import { asRecord, asString } from "../../core/validation/dto.schema";

export function failPmBuild<T>(error_code: ErrorType): PmBuildResult<T> {
  return { success: false, error_code, value: null };
}

export function parsePmTemplateCreate(input: unknown) {
  return parseCreatePmTemplateDto(input);
}

export function parsePmTemplateUpdate(input: unknown) {
  return parseUpdatePmTemplateDto(input);
}

export function parsePmInstanceCreate(input: unknown) {
  return parseCreatePmInstanceDto(input);
}

export function parsePmComplete(input: unknown) {
  return parseCompletePmDto(input);
}

export function parsePmScheduleQuery(input: unknown): { asset_id: string } {
  if (input === undefined) {
    return { asset_id: "" };
  }
  const record = asRecord(input);
  if (record === null) {
    return { asset_id: "" };
  }
  return { asset_id: asString(record.asset_id) };
}

export function buildTemplateForSoftDelete(
  current: PmTemplate,
  timestamp: string,
): PmBuildResult<PmTemplate> {
  if (timestamp === "") {
    return failPmBuild("timestamp required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezePmTemplate({
      tenant_id: current.tenant_id,
      pm_template_id: current.pm_template_id,
      name: current.name,
      interval_miles: current.interval_miles,
      interval_hours: current.interval_hours,
      created_at: current.created_at,
      updated_at: timestamp,
      deleted_at: timestamp,
    }),
  };
}

export function applyTemplateWrite(
  tenant_id: string,
  pm_template_id: string,
  timestamp: string,
  input: PmTemplateWriteInput,
  current: PmTemplate | null,
): PmBuildResult<PmTemplate> {
  if (tenant_id === "") {
    return failPmBuild("tenant_id required");
  }
  if (pm_template_id === "") {
    return failPmBuild("entity_id required");
  }
  if (timestamp === "") {
    return failPmBuild("timestamp required");
  }
  let created_at = timestamp;
  if (current !== null) {
    created_at = current.created_at;
  }
  return {
    success: true,
    error_code: "none",
    value: freezePmTemplate({
      tenant_id,
      pm_template_id,
      name: input.name,
      interval_miles: input.interval_miles,
      interval_hours: input.interval_hours,
      created_at,
      updated_at: timestamp,
      deleted_at: null,
    }),
  };
}

export function freezeCompletedSchedule(schedule: PmSchedule, timestamp: string): PmSchedule {
  return freezePmSchedule({
    tenant_id: schedule.tenant_id,
    pm_schedule_id: schedule.pm_schedule_id,
    asset_id: schedule.asset_id,
    pm_template_id: schedule.pm_template_id,
    due_miles: schedule.due_miles,
    due_hours: schedule.due_hours,
    status: "completed",
    created_at: schedule.created_at,
    updated_at: timestamp,
    deleted_at: schedule.deleted_at,
  });
}
