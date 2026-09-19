import type { ContextDto } from "../../../core/dto/context.dto";
import type { Database } from "../../../core/database/database.interface";
import { createPreparedStatement } from "../../../core/database/prepared-statement";
import type { DiagnosticsOutput } from "../../../aimi/diagnostics/diagnostics-output.interface";
import type { LearningOutput } from "../../../aimi/learning/learning-output.interface";
import type { PredictiveOutput } from "../../../aimi/predictive/predictive-output.interface";
import type { RoutingOutput } from "../../../aimi/routing/routing-output.interface";
import type { SchedulingOutput } from "../../../aimi/scheduling/scheduling-output.interface";
import type { SeverityOutput } from "../../../aimi/severity/severity-output.interface";
import { TechnicianWorkflowAimiAdapter } from "../adapters/technician-workflow-aimi.adapter";
import {
  freezeTechnicianLearningProfile,
  type TechnicianLearningProfile,
  type WorkflowInstance,
  type WorkflowStep,
} from "../technician-workflow.interface";
import { mapTechnicianLearningProfileRow } from "../utils/technician-workflow-mapper";
import { asFiniteNumber, countAsString, normalizeTenantId } from "../utils/technician-workflow-normalizer";

export class WorkflowLearningEngine {
  private readonly tenant_id: string;
  private readonly database: Database;
  private readonly adapter: TechnicianWorkflowAimiAdapter;

  constructor(tenant_id: string, database: Database, adapter: TechnicianWorkflowAimiAdapter) {
    this.tenant_id = normalizeTenantId(tenant_id);
    this.database = database;
    this.adapter = adapter;
  }

  async generate(
    dto: ContextDto,
    workflow: WorkflowInstance,
    steps: readonly WorkflowStep[],
    skipped_count: number,
    voice: boolean,
    multilingual: boolean,
    severity: SeverityOutput | null,
    routing: RoutingOutput | null,
    scheduling: SchedulingOutput | null,
    predictive: PredictiveOutput | null,
    diagnostics: DiagnosticsOutput | null,
    contextInput: unknown,
  ): Promise<LearningOutput | null> {
    return this.adapter.learn(
      dto,
      workflow,
      steps,
      skipped_count,
      voice,
      multilingual,
      severity,
      routing,
      scheduling,
      predictive,
      diagnostics,
      contextInput,
    );
  }

  async loadProfile(user_id: string): Promise<TechnicianLearningProfile | null> {
    if (user_id === "") {
      return null;
    }
    const statement = createPreparedStatement(
      "SELECT profile_id, tenant_id, user_id, steps_taken, steps_skipped, avg_time_to_repair, created_at, updated_at, deleted_at FROM TechnicianLearningProfile WHERE tenant_id = $1 AND user_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, user_id],
    );
    const result = await this.database.execute(statement);
    if (result.rows.length === 0) {
      return null;
    }
    const mapped = mapTechnicianLearningProfileRow(this.tenant_id, result.rows[0]);
    if (mapped.success === false || mapped.value === null) {
      return null;
    }
    return mapped.value;
  }

  applyProfile(
    current: TechnicianLearningProfile | null,
    tenant_id: string,
    profile_id: string,
    user_id: string,
    timestamp: string,
    steps_taken: number,
    steps_skipped: number,
    hours: string,
  ): TechnicianLearningProfile {
    let taken = steps_taken;
    let skipped = steps_skipped;
    let avg = hours;
    let created_at = timestamp;
    if (current !== null) {
      created_at = current.created_at;
      const prior_taken = asFiniteNumber(current.steps_taken);
      const prior_skipped = asFiniteNumber(current.steps_skipped);
      if (prior_taken !== null) {
        taken = prior_taken + steps_taken;
      }
      if (prior_skipped !== null) {
        skipped = prior_skipped + steps_skipped;
      }
      if (hours === "") {
        avg = current.avg_time_to_repair;
      }
    }
    return freezeTechnicianLearningProfile({
      tenant_id,
      profile_id,
      user_id,
      steps_taken: countAsString(taken),
      steps_skipped: countAsString(skipped),
      avg_time_to_repair: avg,
      created_at,
      updated_at: timestamp,
      deleted_at: null,
    });
  }

  async persistProfile(profile: TechnicianLearningProfile, existed: boolean): Promise<void> {
    if (existed === true) {
      const statement = createPreparedStatement(
        "UPDATE TechnicianLearningProfile SET steps_taken = $3, steps_skipped = $4, avg_time_to_repair = $5, updated_at = $6 WHERE tenant_id = $1 AND profile_id = $2 AND deleted_at IS NULL",
        [
          profile.tenant_id,
          profile.profile_id,
          profile.steps_taken,
          profile.steps_skipped,
          profile.avg_time_to_repair,
          profile.updated_at,
        ],
      );
      await this.database.execute(statement);
      return;
    }
    const statement = createPreparedStatement(
      "INSERT INTO TechnicianLearningProfile (profile_id, tenant_id, user_id, steps_taken, steps_skipped, avg_time_to_repair, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $7, $7, NULL)",
      [
        profile.tenant_id,
        profile.profile_id,
        profile.user_id,
        profile.steps_taken,
        profile.steps_skipped,
        profile.avg_time_to_repair,
        profile.created_at,
      ],
    );
    await this.database.execute(statement);
  }
}
