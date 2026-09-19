import type { Database } from "../../../core/database/database.interface";
import { AssetAimiAdapter } from "../adapters/asset-aimi.adapter";
import type { AssetHealth } from "../assets.interface";
import { normalizeTenantId } from "../utils/asset-normalizer";

export class AssetHealthEngine {
  private readonly adapter: AssetAimiAdapter;

  constructor(tenant_id: string, database: Database) {
    normalizeTenantId(tenant_id);
    this.adapter = new AssetAimiAdapter(tenant_id, database);
  }

  async load(asset_id: string): Promise<AssetHealth | null | "error"> {
    return this.adapter.loadHealthByAssetId(asset_id);
  }
}
