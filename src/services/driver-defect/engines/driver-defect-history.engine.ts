import type { Database } from "../../../core/database/database.interface";
import { createPreparedStatement } from "../../../core/database/prepared-statement";
import type { DriverDefect } from "../driver-defect.interface";
import { mapDriverDefectRow } from "../utils/driver-defect-mapper";
import { normalizeTenantId } from "../utils/driver-defect-normalizer";

export class DriverDefectHistoryEngine {
  private readonly tenant_id: string;
  private readonly database: Database;

  constructor(tenant_id: string, database: Database) {
    this.tenant_id = normalizeTenantId(tenant_id);
    this.database = database;
  }

  async loadList(): Promise<readonly DriverDefect[] | null> {
    const statement = createPreparedStatement(
      "SELECT violation_id, tenant_id, asset_id, description, severity, status, created_at, updated_at, deleted_at FROM ComplianceViolations WHERE tenant_id = $1 AND deleted_at IS NULL",
      [this.tenant_id],
    );
    const result = await this.database.execute(statement);
    const rows: DriverDefect[] = [];
    let index = 0;
    while (index < result.rows.length) {
      const mapped = mapDriverDefectRow(this.tenant_id, result.rows[index]);
      if (mapped.success === false || mapped.value === null) {
        return null;
      }
      rows.push(mapped.value);
      index = index + 1;
    }
    return rows;
  }

  async loadByAsset(asset_id: string): Promise<readonly DriverDefect[] | null> {
    if (asset_id === "") {
      return this.loadList();
    }
    const statement = createPreparedStatement(
      "SELECT violation_id, tenant_id, asset_id, description, severity, status, created_at, updated_at, deleted_at FROM ComplianceViolations WHERE tenant_id = $1 AND asset_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, asset_id],
    );
    const result = await this.database.execute(statement);
    const rows: DriverDefect[] = [];
    let index = 0;
    while (index < result.rows.length) {
      const mapped = mapDriverDefectRow(this.tenant_id, result.rows[index]);
      if (mapped.success === false || mapped.value === null) {
        return null;
      }
      rows.push(mapped.value);
      index = index + 1;
    }
    return rows;
  }
}
