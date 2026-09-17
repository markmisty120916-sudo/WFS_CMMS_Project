import type { Database } from "../../../core/database/database.interface";
import { createPreparedStatement } from "../../../core/database/prepared-statement";
import {
  freezePmFinding,
  freezePmHistory,
  type PmCompleteInput,
  type PmFinding,
  type PmHistory,
  type PmSchedule,
} from "../pm.interface";
import { normalizeTenantId } from "../utils/pm-normalizer";

export class PmFindingsEngine {
  private readonly tenant_id: string;
  private readonly database: Database;

  constructor(tenant_id: string, database: Database) {
    this.tenant_id = normalizeTenantId(tenant_id);
    this.database = database;
  }

  buildFinding(schedule: PmSchedule, complete: PmCompleteInput): PmFinding {
    return freezePmFinding({
      tenant_id: this.tenant_id,
      pm_schedule_id: schedule.pm_schedule_id,
      asset_id: schedule.asset_id,
      findings: complete.findings,
      technician_id: complete.technician_id,
    });
  }

  buildHistory(
    pm_history_id: string,
    schedule: PmSchedule,
    timestamp: string,
  ): PmHistory {
    return freezePmHistory({
      tenant_id: this.tenant_id,
      pm_history_id,
      asset_id: schedule.asset_id,
      pm_template_id: schedule.pm_template_id,
      completed_at: timestamp,
      created_at: timestamp,
      updated_at: timestamp,
      deleted_at: null,
    });
  }

  async insertHistory(history: PmHistory): Promise<void> {
    const statement = createPreparedStatement(
      "INSERT INTO PMHistory (pm_history_id, tenant_id, asset_id, pm_template_id, completed_at, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $5, $5, NULL)",
      [
        history.tenant_id,
        history.pm_history_id,
        history.asset_id,
        history.pm_template_id,
        history.completed_at,
      ],
    );
    await this.database.execute(statement);
  }
}
