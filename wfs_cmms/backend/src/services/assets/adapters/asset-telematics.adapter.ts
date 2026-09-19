import type { Database } from "../../../core/database/database.interface";
import { createPreparedStatement } from "../../../core/database/prepared-statement";
import { mapAssetTelematicsRow } from "../utils/asset-mapper";
import { normalizeTenantId } from "../utils/asset-normalizer";
import type { AssetTelematics } from "../assets.interface";

export class AssetTelematicsAdapter {
  private readonly tenant_id: string;
  private readonly database: Database;

  constructor(tenant_id: string, database: Database) {
    this.tenant_id = normalizeTenantId(tenant_id);
    this.database = database;
  }

  async loadByAssetId(asset_id: string): Promise<readonly AssetTelematics[] | null> {
    if (asset_id === "") {
      return null;
    }
    const statement = createPreparedStatement(
      "SELECT telematics_id, tenant_id, asset_id, fault_code, fault_description, severity, timestamp, created_at, updated_at, deleted_at FROM AssetTelematics WHERE tenant_id = $1 AND asset_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, asset_id],
    );
    const result = await this.database.execute(statement);
    const rows: AssetTelematics[] = [];
    let index = 0;
    while (index < result.rows.length) {
      const mapped = mapAssetTelematicsRow(this.tenant_id, asset_id, result.rows[index]);
      if (mapped.success === false || mapped.value === null) {
        return null;
      }
      rows.push(mapped.value);
      index = index + 1;
    }
    return rows;
  }
}
