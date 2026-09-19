import type { Database } from "../../../core/database/database.interface";
import { createPreparedStatement } from "../../../core/database/prepared-statement";
import {
  freezeAssetReadiness,
  type Asset,
  type AssetHealth,
  type AssetPmSchedule,
  type AssetReadiness,
  type AssetTelematics,
} from "../assets.interface";
import { mapAssetPmScheduleRow } from "../utils/asset-mapper";
import { normalizeTenantId } from "../utils/asset-normalizer";

export class AssetReadinessEngine {
  private readonly tenant_id: string;
  private readonly database: Database;

  constructor(tenant_id: string, database: Database) {
    this.tenant_id = normalizeTenantId(tenant_id);
    this.database = database;
  }

  async loadPmSchedules(asset_id: string): Promise<readonly AssetPmSchedule[] | null> {
    if (asset_id === "") {
      return null;
    }
    const statement = createPreparedStatement(
      "SELECT pm_schedule_id, tenant_id, asset_id, pm_template_id, due_miles, due_hours, status, created_at, updated_at, deleted_at FROM PMSchedule WHERE tenant_id = $1 AND asset_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, asset_id],
    );
    const result = await this.database.execute(statement);
    const rows: AssetPmSchedule[] = [];
    let index = 0;
    while (index < result.rows.length) {
      const mapped = mapAssetPmScheduleRow(this.tenant_id, asset_id, result.rows[index]);
      if (mapped.success === false || mapped.value === null) {
        return null;
      }
      rows.push(mapped.value);
      index = index + 1;
    }
    return rows;
  }

  build(
    asset: Asset,
    health: AssetHealth | null,
    telematics: readonly AssetTelematics[],
    pm_schedules: readonly AssetPmSchedule[],
  ): AssetReadiness {
    let health_score = "";
    let predictive_score = "";
    if (health !== null) {
      health_score = health.health_score;
      predictive_score = health.predictive_score;
    }
    return freezeAssetReadiness({
      tenant_id: asset.tenant_id,
      asset_id: asset.asset_id,
      asset_status: asset.status,
      health_score,
      predictive_score,
      telematics_count: String(telematics.length),
      pm_schedule_count: String(pm_schedules.length),
    });
  }
}
