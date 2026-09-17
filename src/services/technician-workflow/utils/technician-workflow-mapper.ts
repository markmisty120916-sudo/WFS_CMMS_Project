import type { ErrorType } from "../../../core/errors/error-types";
import { workflowTenantError } from "../technician-workflow-rules";
import {
  freezeDiagnosticHistory,
  freezeTechnicianLearningProfile,
  freezeWorkflowInstance,
  freezeWorkflowLabor,
  freezeWorkflowStep,
  type DiagnosticHistory,
  type TechnicianLearningProfile,
  type TechnicianWorkflowBuildResult,
  type WorkflowInstance,
  type WorkflowLabor,
  type WorkflowStep,
} from "../technician-workflow.interface";
import { asDeletedAt, asFieldString } from "./technician-workflow-normalizer";

function fail<T>(error_code: ErrorType): TechnicianWorkflowBuildResult<T> {
  return { success: false, error_code, value: null };
}

export function mapWorkflowInstanceRow(
  tenant_id: string,
  row: Readonly<Record<string, unknown>>,
): TechnicianWorkflowBuildResult<WorkflowInstance> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = workflowTenantError(tenant_id, record_tenant_id);
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
    value: freezeWorkflowInstance({
      tenant_id: record_tenant_id,
      workorder_id,
      asset_id: asFieldString(row.asset_id),
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

export function mapWorkflowStepRow(
  tenant_id: string,
  row: Readonly<Record<string, unknown>>,
): TechnicianWorkflowBuildResult<WorkflowStep> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = workflowTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const note_id = asFieldString(row.note_id);
  if (note_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeWorkflowStep({
      tenant_id: record_tenant_id,
      note_id,
      workorder_id: asFieldString(row.workorder_id),
      user_id: asFieldString(row.user_id),
      note_text: asFieldString(row.note_text),
      created_at: asFieldString(row.created_at),
      updated_at: asFieldString(row.updated_at),
      deleted_at: asDeletedAt(row.deleted_at),
    }),
  };
}

export function mapWorkflowLaborRow(
  tenant_id: string,
  row: Readonly<Record<string, unknown>>,
): TechnicianWorkflowBuildResult<WorkflowLabor> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = workflowTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const labor_id = asFieldString(row.labor_id);
  if (labor_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeWorkflowLabor({
      tenant_id: record_tenant_id,
      labor_id,
      workorder_id: asFieldString(row.workorder_id),
      user_id: asFieldString(row.user_id),
      hours: asFieldString(row.hours),
      created_at: asFieldString(row.created_at),
      updated_at: asFieldString(row.updated_at),
      deleted_at: asDeletedAt(row.deleted_at),
    }),
  };
}

export function mapDiagnosticHistoryRow(
  tenant_id: string,
  row: Readonly<Record<string, unknown>>,
): TechnicianWorkflowBuildResult<DiagnosticHistory> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = workflowTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const diagnostic_id = asFieldString(row.diagnostic_id);
  if (diagnostic_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeDiagnosticHistory({
      tenant_id: record_tenant_id,
      diagnostic_id,
      workorder_id: asFieldString(row.workorder_id),
      steps_taken: asFieldString(row.steps_taken),
      steps_skipped: asFieldString(row.steps_skipped),
      outcome: asFieldString(row.outcome),
      created_at: asFieldString(row.created_at),
      updated_at: asFieldString(row.updated_at),
      deleted_at: asDeletedAt(row.deleted_at),
    }),
  };
}

export function mapTechnicianLearningProfileRow(
  tenant_id: string,
  row: Readonly<Record<string, unknown>>,
): TechnicianWorkflowBuildResult<TechnicianLearningProfile> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = workflowTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const profile_id = asFieldString(row.profile_id);
  if (profile_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeTechnicianLearningProfile({
      tenant_id: record_tenant_id,
      profile_id,
      user_id: asFieldString(row.user_id),
      steps_taken: asFieldString(row.steps_taken),
      steps_skipped: asFieldString(row.steps_skipped),
      avg_time_to_repair: asFieldString(row.avg_time_to_repair),
      created_at: asFieldString(row.created_at),
      updated_at: asFieldString(row.updated_at),
      deleted_at: asDeletedAt(row.deleted_at),
    }),
  };
}
