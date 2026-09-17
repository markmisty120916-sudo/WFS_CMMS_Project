import type { Database } from "../../../core/database/database.interface";
import { AssetTelematicsAdapter } from "../adapters/asset-telematics.adapter";
import type { AssetTelematics } from "../assets.interface";
import { normalizeTenantId } from "../utils/asset-normalizer";

export class AssetTelematicsEngine {
  private readonly adapter: AssetTelematicsAdapter;

  constructor(tenant_id: string, database: Database) {
    normalizeTenantId(tenant_id);
    this.adapter = new AssetTelematicsAdapter(tenant_id, database);
  }

  async load(asset_id: string): Promise<readonly AssetTelematics[] | null> {
    return this.adapter.loadByAssetId(asset_id);
  }
}
