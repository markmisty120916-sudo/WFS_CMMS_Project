import type { Database } from "../../../core/database/database.interface";
import {
  createPreparedStatement,
  type PreparedStatement,
} from "../../../core/database/prepared-statement";
import {
  freezeAssetMeters,
  type Asset,
  type AssetMeters,
} from "../assets.interface";
import { mapAssetRow } from "../utils/asset-mapper";
import { normalizeTenantId } from "../utils/asset-normalizer";

export class AssetProfileEngine {
  private readonly tenant_id: string;
  private readonly database: Database;

  constructor(tenant_id: string, database: Database) {
    this.tenant_id = normalizeTenantId(tenant_id);
    this.database = database;
  }

  async load(asset_id: string): Promise<Asset | null> {
    if (asset_id === "") {
      return null;
    }
    const statement = createPreparedStatement(
      "SELECT asset_id, tenant_id, vin, unit_number, make, model, year, mileage, hours, status, created_at, updated_at, deleted_at FROM Assets WHERE tenant_id = $1 AND asset_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, asset_id],
    );
    const result = await this.database.execute(statement);
    if (result.rows.length === 0) {
      return null;
    }
    const mapped = mapAssetRow(this.tenant_id, result.rows[0]);
    if (mapped.success === false || mapped.value === null) {
      return null;
    }
    return mapped.value;
  }

  async loadList(status: string): Promise<readonly Asset[] | null> {
    let statement: PreparedStatement;
    if (status === "") {
      statement = createPreparedStatement(
        "SELECT asset_id, tenant_id, vin, unit_number, make, model, year, mileage, hours, status, created_at, updated_at, deleted_at FROM Assets WHERE tenant_id = $1 AND deleted_at IS NULL",
        [this.tenant_id],
      );
    } else {
      statement = createPreparedStatement(
        "SELECT asset_id, tenant_id, vin, unit_number, make, model, year, mileage, hours, status, created_at, updated_at, deleted_at FROM Assets WHERE tenant_id = $1 AND deleted_at IS NULL AND status = $2",
        [this.tenant_id, status],
      );
    }
    const result = await this.database.execute(statement);
    const assets: Asset[] = [];
    let index = 0;
    while (index < result.rows.length) {
      const mapped = mapAssetRow(this.tenant_id, result.rows[index]);
      if (mapped.success === false || mapped.value === null) {
        return null;
      }
      assets.push(mapped.value);
      index = index + 1;
    }
    return assets;
  }

  metersFromAsset(asset: Asset): AssetMeters {
    return freezeAssetMeters({
      tenant_id: asset.tenant_id,
      asset_id: asset.asset_id,
      mileage: asset.mileage,
      hours: asset.hours,
    });
  }
}
