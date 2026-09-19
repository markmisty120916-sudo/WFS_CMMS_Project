import type { Database } from "../../../core/database/database.interface";
import { createPreparedStatement } from "../../../core/database/prepared-statement";
import {
  freezeAssetHistory,
  type AssetDiagnostic,
  type AssetHistory,
  type AssetPmHistory,
  type AssetWorkorder,
} from "../assets.interface";
import {
  mapAssetDiagnosticRow,
  mapAssetPmHistoryRow,
  mapAssetWorkorderRow,
} from "../utils/asset-mapper";
import { normalizeTenantId } from "../utils/asset-normalizer";

export class AssetHistoryEngine {
  private readonly tenant_id: string;
  private readonly database: Database;

  constructor(tenant_id: string, database: Database) {
    this.tenant_id = normalizeTenantId(tenant_id);
    this.database = database;
  }

  async load(asset_id: string): Promise<AssetHistory | null> {
    if (asset_id === "") {
      return null;
    }
    const workorders = await this.loadWorkorders(asset_id);
    if (workorders === null) {
      return null;
    }
    const pm_history = await this.loadPmHistory(asset_id);
    if (pm_history === null) {
      return null;
    }
    const diagnostics = await this.loadDiagnostics(asset_id);
    if (diagnostics === null) {
      return null;
    }
    return freezeAssetHistory({
      tenant_id: this.tenant_id,
      asset_id,
      workorders,
      pm_history,
      diagnostics,
    });
  }

  private async loadWorkorders(asset_id: string): Promise<readonly AssetWorkorder[] | null> {
    const statement = createPreparedStatement(
      "SELECT workorder_id, tenant_id, asset_id, source, description, severity, routing_tech_id, routing_bay_id, scheduled_start, scheduled_end, status, created_by, created_at, updated_at, deleted_at FROM Workorders WHERE tenant_id = $1 AND asset_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, asset_id],
    );
    const result = await this.database.execute(statement);
    const rows: AssetWorkorder[] = [];
    let index = 0;
    while (index < result.rows.length) {
      const mapped = mapAssetWorkorderRow(this.tenant_id, asset_id, result.rows[index]);
      if (mapped.success === false || mapped.value === null) {
        return null;
      }
      rows.push(mapped.value);
      index = index + 1;
    }
    return rows;
  }

  private async loadPmHistory(asset_id: string): Promise<readonly AssetPmHistory[] | null> {
    const statement = createPreparedStatement(
      "SELECT pm_history_id, tenant_id, asset_id, pm_template_id, completed_at, created_at, updated_at, deleted_at FROM PMHistory WHERE tenant_id = $1 AND asset_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, asset_id],
    );
    const result = await this.database.execute(statement);
    const rows: AssetPmHistory[] = [];
    let index = 0;
    while (index < result.rows.length) {
      const mapped = mapAssetPmHistoryRow(this.tenant_id, asset_id, result.rows[index]);
      if (mapped.success === false || mapped.value === null) {
        return null;
      }
      rows.push(mapped.value);
      index = index + 1;
    }
    return rows;
  }

  private async loadDiagnostics(asset_id: string): Promise<readonly AssetDiagnostic[] | null> {
    const statement = createPreparedStatement(
      "SELECT d.diagnostic_id, d.tenant_id, d.workorder_id, w.asset_id, d.steps_taken, d.steps_skipped, d.outcome, d.created_at, d.updated_at, d.deleted_at FROM DiagnosticHistory d INNER JOIN Workorders w ON w.workorder_id = d.workorder_id AND w.tenant_id = d.tenant_id WHERE d.tenant_id = $1 AND w.asset_id = $2 AND d.deleted_at IS NULL AND w.deleted_at IS NULL",
      [this.tenant_id, asset_id],
    );
    const result = await this.database.execute(statement);
    const rows: AssetDiagnostic[] = [];
    let index = 0;
    while (index < result.rows.length) {
      const mapped = mapAssetDiagnosticRow(this.tenant_id, asset_id, result.rows[index]);
      if (mapped.success === false || mapped.value === null) {
        return null;
      }
      rows.push(mapped.value);
      index = index + 1;
    }
    return rows;
  }
}
