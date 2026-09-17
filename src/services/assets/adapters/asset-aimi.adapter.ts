import type { Database } from "../../../core/database/database.interface";
import { createPreparedStatement } from "../../../core/database/prepared-statement";
import { mapAssetHealthRow } from "../utils/asset-mapper";
import { normalizeTenantId } from "../utils/asset-normalizer";
import type { AssetHealth } from "../assets.interface";

export class AssetAimiAdapter {
  private readonly tenant_id: string;
  private readonly database: Database;

  constructor(tenant_id: string, database: Database) {
    this.tenant_id = normalizeTenantId(tenant_id);
    this.database = database;
  }

  async loadHealthByAssetId(asset_id: string): Promise<AssetHealth | null | "error"> {
    if (asset_id === "") {
      return "error";
    }
    const statement = createPreparedStatement(
      "SELECT health_id, tenant_id, asset_id, health_score, predictive_score, last_update, created_at, updated_at, deleted_at FROM AssetHealth WHERE tenant_id = $1 AND asset_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, asset_id],
    );
    const result = await this.database.execute(statement);
    if (result.rows.length === 0) {
      return null;
    }
    const mapped = mapAssetHealthRow(this.tenant_id, asset_id, result.rows[0]);
    if (mapped.success === false || mapped.value === null) {
      return "error";
    }
    return mapped.value;
  }
}
