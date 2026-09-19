import type { ContextDto } from "../../../core/dto/context.dto";
import type { Database } from "../../../core/database/database.interface";
import { createPreparedStatement } from "../../../core/database/prepared-statement";
import type { DiagnosticsOutput } from "../../../aimi/diagnostics/diagnostics-output.interface";
import type { PredictiveOutput } from "../../../aimi/predictive/predictive-output.interface";
import type { RoutingOutput } from "../../../aimi/routing/routing-output.interface";
import type { SchedulingOutput } from "../../../aimi/scheduling/scheduling-output.interface";
import type { SeverityOutput } from "../../../aimi/severity/severity-output.interface";
import { TechnicianWorkflowAimiAdapter } from "../adapters/technician-workflow-aimi.adapter";
import {
  freezeDiagnosticHistory,
  type DiagnosticHistory,
  type WorkflowInstance,
  type WorkflowStep,
} from "../technician-workflow.interface";
import { countAsString, normalizeTenantId } from "../utils/technician-workflow-normalizer";

export class WorkflowDiagnosticsEngine {
  private readonly tenant_id: string;
  private readonly database: Database;
  private readonly adapter: TechnicianWorkflowAimiAdapter;

  constructor(tenant_id: string, database: Database, adapter: TechnicianWorkflowAimiAdapter) {
    this.tenant_id = normalizeTenantId(tenant_id);
    this.database = database;
    this.adapter = adapter;
  }

  async start(
    dto: ContextDto,
    workflow: WorkflowInstance,
    severity: SeverityOutput | null,
    routing: RoutingOutput | null,
    scheduling: SchedulingOutput | null,
    predictive: PredictiveOutput | null,
    contextInput: unknown,
  ): Promise<DiagnosticsOutput | null> {
    return this.adapter.diagnose(
      dto,
      workflow,
      severity,
      routing,
      scheduling,
      predictive,
      contextInput,
    );
  }

  buildHistory(
    workorder_id: string,
    timestamp: string,
    steps: readonly WorkflowStep[],
    skipped_count: number,
    outcome: string,
  ): DiagnosticHistory {
    return freezeDiagnosticHistory({
      tenant_id: this.tenant_id,
      diagnostic_id: workorder_id + ":diagnostic:" + timestamp,
      workorder_id,
      steps_taken: countAsString(steps.length),
      steps_skipped: countAsString(skipped_count),
      outcome,
      created_at: timestamp,
      updated_at: timestamp,
      deleted_at: null,
    });
  }

  async insertHistory(history: DiagnosticHistory): Promise<void> {
    const statement = createPreparedStatement(
      "INSERT INTO DiagnosticHistory (diagnostic_id, tenant_id, workorder_id, steps_taken, steps_skipped, outcome, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $7, $7, NULL)",
      [
        history.tenant_id,
        history.diagnostic_id,
        history.workorder_id,
        history.steps_taken,
        history.steps_skipped,
        history.outcome,
        history.created_at,
      ],
    );
    await this.database.execute(statement);
  }
}
