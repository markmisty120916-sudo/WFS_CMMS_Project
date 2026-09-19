import type { DtoRole } from "../../core/dto/base.dto";
import type { ErrorType } from "../../core/errors/error-types";
import type { DiagnosticsOutput } from "../../aimi/diagnostics/diagnostics-output.interface";
import type { LearningOutput } from "../../aimi/learning/learning-output.interface";
import type { PredictiveOutput } from "../../aimi/predictive/predictive-output.interface";
import type { RoutingOutput } from "../../aimi/routing/routing-output.interface";
import type { SchedulingOutput } from "../../aimi/scheduling/scheduling-output.interface";
import type { SeverityOutput } from "../../aimi/severity/severity-output.interface";

export type TechnicianWorkflowBuildResult<T> =
  | { success: true; error_code: "none"; value: T }
  | { success: false; error_code: ErrorType; value: null };

export type WorkflowInstance = {
  readonly tenant_id: string;
  readonly workorder_id: string;
  readonly asset_id: string;
  readonly source: string;
  readonly description: string;
  readonly severity: string;
  readonly routing_tech_id: string;
  readonly routing_bay_id: string;
  readonly scheduled_start: string;
  readonly scheduled_end: string;
  readonly status: string;
  readonly created_by: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type WorkflowStep = {
  readonly tenant_id: string;
  readonly note_id: string;
  readonly workorder_id: string;
  readonly user_id: string;
  readonly note_text: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type WorkflowLabor = {
  readonly tenant_id: string;
  readonly labor_id: string;
  readonly workorder_id: string;
  readonly user_id: string;
  readonly hours: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type DiagnosticHistory = {
  readonly tenant_id: string;
  readonly diagnostic_id: string;
  readonly workorder_id: string;
  readonly steps_taken: string;
  readonly steps_skipped: string;
  readonly outcome: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type TechnicianLearningProfile = {
  readonly tenant_id: string;
  readonly profile_id: string;
  readonly user_id: string;
  readonly steps_taken: string;
  readonly steps_skipped: string;
  readonly avg_time_to_repair: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type StartWorkflowInput = {
  readonly workorder_id: string;
  readonly voice: boolean;
  readonly multilingual: boolean;
};

export type UpdateWorkflowStepInput = {
  readonly note_text: string;
  readonly skipped: boolean;
  readonly hours: string;
};

export type CompleteWorkflowInput = {
  readonly outcome: string;
  readonly hours: string;
  readonly voice: boolean;
  readonly multilingual: boolean;
};

export type TechnicianActionInput = {
  readonly note_text: string;
  readonly hours: string;
};

export type WorkflowListQuery = {
  readonly status: string;
  readonly asset_id: string;
};

export type WorkflowListResult = {
  readonly tenant_id: string;
  readonly role: DtoRole;
  readonly workflows: readonly WorkflowInstance[];
};

export type WorkflowActionResult = {
  readonly tenant_id: string;
  readonly workflow: WorkflowInstance;
  readonly steps: readonly WorkflowStep[];
  readonly labor: WorkflowLabor | null;
  readonly history: DiagnosticHistory | null;
  readonly profile: TechnicianLearningProfile | null;
  readonly severity: SeverityOutput | null;
  readonly routing: RoutingOutput | null;
  readonly scheduling: SchedulingOutput | null;
  readonly diagnostics: DiagnosticsOutput | null;
  readonly predictive: PredictiveOutput | null;
  readonly learning: LearningOutput | null;
  readonly voice: boolean;
  readonly multilingual: boolean;
};

export function freezeWorkflowInstance(row: WorkflowInstance): WorkflowInstance {
  return Object.freeze({
    tenant_id: row.tenant_id,
    workorder_id: row.workorder_id,
    asset_id: row.asset_id,
    source: row.source,
    description: row.description,
    severity: row.severity,
    routing_tech_id: row.routing_tech_id,
    routing_bay_id: row.routing_bay_id,
    scheduled_start: row.scheduled_start,
    scheduled_end: row.scheduled_end,
    status: row.status,
    created_by: row.created_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  });
}

export function freezeWorkflowStep(row: WorkflowStep): WorkflowStep {
  return Object.freeze({
    tenant_id: row.tenant_id,
    note_id: row.note_id,
    workorder_id: row.workorder_id,
    user_id: row.user_id,
    note_text: row.note_text,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  });
}

export function freezeWorkflowLabor(row: WorkflowLabor): WorkflowLabor {
  return Object.freeze({
    tenant_id: row.tenant_id,
    labor_id: row.labor_id,
    workorder_id: row.workorder_id,
    user_id: row.user_id,
    hours: row.hours,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  });
}

export function freezeDiagnosticHistory(row: DiagnosticHistory): DiagnosticHistory {
  return Object.freeze({
    tenant_id: row.tenant_id,
    diagnostic_id: row.diagnostic_id,
    workorder_id: row.workorder_id,
    steps_taken: row.steps_taken,
    steps_skipped: row.steps_skipped,
    outcome: row.outcome,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  });
}

export function freezeTechnicianLearningProfile(row: TechnicianLearningProfile): TechnicianLearningProfile {
  return Object.freeze({
    tenant_id: row.tenant_id,
    profile_id: row.profile_id,
    user_id: row.user_id,
    steps_taken: row.steps_taken,
    steps_skipped: row.steps_skipped,
    avg_time_to_repair: row.avg_time_to_repair,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  });
}

export function freezeWorkflowListResult(result: WorkflowListResult): WorkflowListResult {
  const workflows: WorkflowInstance[] = [];
  let index = 0;
  while (index < result.workflows.length) {
    workflows.push(result.workflows[index]);
    index = index + 1;
  }
  return Object.freeze({
    tenant_id: result.tenant_id,
    role: result.role,
    workflows: Object.freeze(workflows),
  });
}

export function freezeWorkflowActionResult(row: WorkflowActionResult): WorkflowActionResult {
  const steps: WorkflowStep[] = [];
  let index = 0;
  while (index < row.steps.length) {
    steps.push(row.steps[index]);
    index = index + 1;
  }
  return Object.freeze({
    tenant_id: row.tenant_id,
    workflow: row.workflow,
    steps: Object.freeze(steps),
    labor: row.labor,
    history: row.history,
    profile: row.profile,
    severity: row.severity,
    routing: row.routing,
    scheduling: row.scheduling,
    diagnostics: row.diagnostics,
    predictive: row.predictive,
    learning: row.learning,
    voice: row.voice,
    multilingual: row.multilingual,
  });
}
