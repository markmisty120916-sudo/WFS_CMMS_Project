import type { Database } from "../../../core/database/database.interface";
import { createPreparedStatement } from "../../../core/database/prepared-statement";
import {
  freezeWorkflowInstance,
  freezeWorkflowLabor,
  freezeWorkflowStep,
  type WorkflowInstance,
  type WorkflowLabor,
  type WorkflowStep,
} from "../technician-workflow.interface";
import { mapWorkflowInstanceRow, mapWorkflowLaborRow, mapWorkflowStepRow } from "../utils/technician-workflow-mapper";
import { normalizeTenantId } from "../utils/technician-workflow-normalizer";

export class WorkflowStepsEngine {
  private readonly tenant_id: string;
  private readonly database: Database;

  constructor(tenant_id: string, database: Database) {
    this.tenant_id = normalizeTenantId(tenant_id);
    this.database = database;
  }

  async loadWorkflow(workorder_id: string): Promise<WorkflowInstance | null> {
    if (workorder_id === "") {
      return null;
    }
    const statement = createPreparedStatement(
      "SELECT workorder_id, tenant_id, asset_id, source, description, severity, routing_tech_id, routing_bay_id, scheduled_start, scheduled_end, status, created_by, created_at, updated_at, deleted_at FROM Workorders WHERE tenant_id = $1 AND workorder_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, workorder_id],
    );
    const result = await this.database.execute(statement);
    if (result.rows.length === 0) {
      return null;
    }
    const mapped = mapWorkflowInstanceRow(this.tenant_id, result.rows[0]);
    if (mapped.success === false || mapped.value === null) {
      return null;
    }
    return mapped.value;
  }

  async loadWorkflowList(): Promise<readonly WorkflowInstance[] | null> {
    const statement = createPreparedStatement(
      "SELECT workorder_id, tenant_id, asset_id, source, description, severity, routing_tech_id, routing_bay_id, scheduled_start, scheduled_end, status, created_by, created_at, updated_at, deleted_at FROM Workorders WHERE tenant_id = $1 AND deleted_at IS NULL",
      [this.tenant_id],
    );
    const result = await this.database.execute(statement);
    const rows: WorkflowInstance[] = [];
    let index = 0;
    while (index < result.rows.length) {
      const mapped = mapWorkflowInstanceRow(this.tenant_id, result.rows[index]);
      if (mapped.success === false || mapped.value === null) {
        return null;
      }
      rows.push(mapped.value);
      index = index + 1;
    }
    return rows;
  }

  applyStarted(current: WorkflowInstance, timestamp: string, user_id: string): WorkflowInstance {
    let routing_tech_id = current.routing_tech_id;
    if (routing_tech_id === "") {
      routing_tech_id = user_id;
    }
    return freezeWorkflowInstance({
      tenant_id: current.tenant_id,
      workorder_id: current.workorder_id,
      asset_id: current.asset_id,
      source: current.source,
      description: current.description,
      severity: current.severity,
      routing_tech_id,
      routing_bay_id: current.routing_bay_id,
      scheduled_start: current.scheduled_start,
      scheduled_end: current.scheduled_end,
      status: "started",
      created_by: current.created_by,
      created_at: current.created_at,
      updated_at: timestamp,
      deleted_at: current.deleted_at,
    });
  }

  applyCompleted(current: WorkflowInstance, timestamp: string): WorkflowInstance {
    return freezeWorkflowInstance({
      tenant_id: current.tenant_id,
      workorder_id: current.workorder_id,
      asset_id: current.asset_id,
      source: current.source,
      description: current.description,
      severity: current.severity,
      routing_tech_id: current.routing_tech_id,
      routing_bay_id: current.routing_bay_id,
      scheduled_start: current.scheduled_start,
      scheduled_end: current.scheduled_end,
      status: "completed",
      created_by: current.created_by,
      created_at: current.created_at,
      updated_at: timestamp,
      deleted_at: current.deleted_at,
    });
  }

  applySeverity(current: WorkflowInstance, severity: string, timestamp: string): WorkflowInstance {
    return freezeWorkflowInstance({
      tenant_id: current.tenant_id,
      workorder_id: current.workorder_id,
      asset_id: current.asset_id,
      source: current.source,
      description: current.description,
      severity,
      routing_tech_id: current.routing_tech_id,
      routing_bay_id: current.routing_bay_id,
      scheduled_start: current.scheduled_start,
      scheduled_end: current.scheduled_end,
      status: current.status,
      created_by: current.created_by,
      created_at: current.created_at,
      updated_at: timestamp,
      deleted_at: current.deleted_at,
    });
  }

  async updateWorkflow(workflow: WorkflowInstance): Promise<void> {
    const statement = createPreparedStatement(
      "UPDATE Workorders SET severity = $3, routing_tech_id = $4, routing_bay_id = $5, scheduled_start = $6, scheduled_end = $7, status = $8, updated_at = $9 WHERE tenant_id = $1 AND workorder_id = $2 AND deleted_at IS NULL",
      [
        workflow.tenant_id,
        workflow.workorder_id,
        workflow.severity,
        workflow.routing_tech_id,
        workflow.routing_bay_id,
        workflow.scheduled_start,
        workflow.scheduled_end,
        workflow.status,
        workflow.updated_at,
      ],
    );
    await this.database.execute(statement);
  }

  buildStep(
    tenant_id: string,
    note_id: string,
    workorder_id: string,
    user_id: string,
    note_text: string,
    skipped: boolean,
    timestamp: string,
  ): WorkflowStep {
    let text = note_text;
    if (skipped === true) {
      text = "skipped:" + note_text;
    }
    return freezeWorkflowStep({
      tenant_id,
      note_id,
      workorder_id,
      user_id,
      note_text: text,
      created_at: timestamp,
      updated_at: timestamp,
      deleted_at: null,
    });
  }

  async insertStep(step: WorkflowStep): Promise<void> {
    const statement = createPreparedStatement(
      "INSERT INTO WorkorderNotes (note_id, tenant_id, workorder_id, user_id, note_text, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $6, NULL)",
      [
        step.tenant_id,
        step.note_id,
        step.workorder_id,
        step.user_id,
        step.note_text,
        step.created_at,
      ],
    );
    await this.database.execute(statement);
  }

  async loadSteps(workorder_id: string): Promise<readonly WorkflowStep[] | null> {
    const statement = createPreparedStatement(
      "SELECT note_id, tenant_id, workorder_id, user_id, note_text, created_at, updated_at, deleted_at FROM WorkorderNotes WHERE tenant_id = $1 AND workorder_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, workorder_id],
    );
    const result = await this.database.execute(statement);
    const rows: WorkflowStep[] = [];
    let index = 0;
    while (index < result.rows.length) {
      const mapped = mapWorkflowStepRow(this.tenant_id, result.rows[index]);
      if (mapped.success === false || mapped.value === null) {
        return null;
      }
      rows.push(mapped.value);
      index = index + 1;
    }
    return rows;
  }

  buildLabor(
    tenant_id: string,
    labor_id: string,
    workorder_id: string,
    user_id: string,
    hours: string,
    timestamp: string,
  ): WorkflowLabor | null {
    if (hours === "") {
      return null;
    }
    return freezeWorkflowLabor({
      tenant_id,
      labor_id,
      workorder_id,
      user_id,
      hours,
      created_at: timestamp,
      updated_at: timestamp,
      deleted_at: null,
    });
  }

  async insertLabor(labor: WorkflowLabor): Promise<void> {
    const statement = createPreparedStatement(
      "INSERT INTO WorkorderLabor (labor_id, tenant_id, workorder_id, user_id, hours, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $6, NULL)",
      [
        labor.tenant_id,
        labor.labor_id,
        labor.workorder_id,
        labor.user_id,
        labor.hours,
        labor.created_at,
      ],
    );
    await this.database.execute(statement);
  }

  skippedCount(steps: readonly WorkflowStep[]): number {
    let count = 0;
    let index = 0;
    while (index < steps.length) {
      if (steps[index].note_text.indexOf("skipped:") === 0) {
        count = count + 1;
      }
      index = index + 1;
    }
    return count;
  }
}
