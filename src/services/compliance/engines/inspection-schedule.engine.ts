import type { Database } from "../../../core/database/database.interface";
import {
  createPreparedStatement,
  type PreparedStatement,
} from "../../../core/database/prepared-statement";
import {
  freezeInspectionInstance,
  type InspectionInstance,
  type InspectionInstanceWriteInput,
} from "../compliance.interface";
import { mapInspectionInstanceRow } from "../utils/compliance-mapper";
import { normalizeTenantId } from "../utils/compliance-normalizer";

export class InspectionScheduleEngine {
  private readonly tenant_id: string;
  private readonly database: Database;

  constructor(tenant_id: string, database: Database) {
    this.tenant_id = normalizeTenantId(tenant_id);
    this.database = database;
  }

  async load(inspection_id: string): Promise<InspectionInstance | null> {
    if (inspection_id === "") {
      return null;
    }
    const statement = createPreparedStatement(
      "SELECT inspection_id, tenant_id, asset_id, type, status, created_at, updated_at, deleted_at FROM ComplianceInspections WHERE tenant_id = $1 AND inspection_id = $2 AND status <> $3 AND deleted_at IS NULL",
      [this.tenant_id, inspection_id, "template"],
    );
    const result = await this.database.execute(statement);
    if (result.rows.length === 0) {
      return null;
    }
    const mapped = mapInspectionInstanceRow(this.tenant_id, result.rows[0]);
    if (mapped.success === false || mapped.value === null) {
      return null;
    }
    return mapped.value;
  }

  async loadList(asset_id: string): Promise<readonly InspectionInstance[] | null> {
    let statement: PreparedStatement;
    if (asset_id === "") {
      statement = createPreparedStatement(
        "SELECT inspection_id, tenant_id, asset_id, type, status, created_at, updated_at, deleted_at FROM ComplianceInspections WHERE tenant_id = $1 AND status <> $2 AND deleted_at IS NULL",
        [this.tenant_id, "template"],
      );
    } else {
      statement = createPreparedStatement(
        "SELECT inspection_id, tenant_id, asset_id, type, status, created_at, updated_at, deleted_at FROM ComplianceInspections WHERE tenant_id = $1 AND asset_id = $2 AND status <> $3 AND deleted_at IS NULL",
        [this.tenant_id, asset_id, "template"],
      );
    }
    const result = await this.database.execute(statement);
    const rows: InspectionInstance[] = [];
    let index = 0;
    while (index < result.rows.length) {
      const mapped = mapInspectionInstanceRow(this.tenant_id, result.rows[index]);
      if (mapped.success === false || mapped.value === null) {
        return null;
      }
      rows.push(mapped.value);
      index = index + 1;
    }
    return rows;
  }

  async insert(instance: InspectionInstance): Promise<void> {
    const statement = createPreparedStatement(
      "INSERT INTO ComplianceInspections (inspection_id, tenant_id, asset_id, type, status, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $6, NULL)",
      [
        instance.tenant_id,
        instance.inspection_id,
        instance.asset_id,
        instance.type,
        instance.status,
        instance.created_at,
      ],
    );
    await this.database.execute(statement);
  }

  async markCompleted(instance: InspectionInstance, result: string, timestamp: string): Promise<InspectionInstance> {
    const next = freezeInspectionInstance({
      tenant_id: instance.tenant_id,
      inspection_id: instance.inspection_id,
      asset_id: instance.asset_id,
      type: instance.type,
      status: result,
      created_at: instance.created_at,
      updated_at: timestamp,
      deleted_at: instance.deleted_at,
    });
    const statement = createPreparedStatement(
      "UPDATE ComplianceInspections SET status = $3, updated_at = $4 WHERE tenant_id = $1 AND inspection_id = $2 AND deleted_at IS NULL",
      [next.tenant_id, next.inspection_id, next.status, next.updated_at],
    );
    await this.database.execute(statement);
    return next;
  }

  buildInstance(
    tenant_id: string,
    inspection_id: string,
    timestamp: string,
    input: InspectionInstanceWriteInput,
  ): InspectionInstance {
    return freezeInspectionInstance({
      tenant_id,
      inspection_id,
      asset_id: input.asset_id,
      type: input.type,
      status: "scheduled",
      created_at: timestamp,
      updated_at: timestamp,
      deleted_at: null,
    });
  }
}
