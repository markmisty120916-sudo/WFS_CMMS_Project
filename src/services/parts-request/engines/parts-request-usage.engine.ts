import type { Database } from "../../../core/database/database.interface";
import { createPreparedStatement } from "../../../core/database/prepared-statement";
import { freezePartsUsage, type PartsRequest, type PartsUsage } from "../parts-request.interface";
import { mapPartsUsageRow } from "../utils/parts-request-mapper";
import { normalizeTenantId } from "../utils/parts-request-normalizer";

export class PartsRequestUsageEngine {
  private readonly tenant_id: string;
  private readonly database: Database;

  constructor(tenant_id: string, database: Database) {
    this.tenant_id = normalizeTenantId(tenant_id);
    this.database = database;
  }

  buildFromApproval(request: PartsRequest, timestamp: string): PartsUsage {
    return freezePartsUsage({
      tenant_id: request.tenant_id,
      part_usage_id: request.request_id + ":usage:" + timestamp,
      workorder_id: request.workorder_id,
      part_id: request.part_id,
      quantity: request.quantity,
      created_at: timestamp,
      updated_at: timestamp,
      deleted_at: null,
    });
  }

  async insert(usage: PartsUsage): Promise<void> {
    const statement = createPreparedStatement(
      "INSERT INTO WorkorderParts (part_usage_id, tenant_id, workorder_id, part_id, quantity, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $6, NULL)",
      [
        usage.tenant_id,
        usage.part_usage_id,
        usage.workorder_id,
        usage.part_id,
        usage.quantity,
        usage.created_at,
      ],
    );
    await this.database.execute(statement);
  }

  async loadByRequest(request: PartsRequest): Promise<readonly PartsUsage[] | null> {
    const statement = createPreparedStatement(
      "SELECT part_usage_id, tenant_id, workorder_id, part_id, quantity, created_at, updated_at, deleted_at FROM WorkorderParts WHERE tenant_id = $1 AND workorder_id = $2 AND part_id = $3 AND deleted_at IS NULL",
      [this.tenant_id, request.workorder_id, request.part_id],
    );
    const result = await this.database.execute(statement);
    const rows: PartsUsage[] = [];
    let index = 0;
    while (index < result.rows.length) {
      const mapped = mapPartsUsageRow(this.tenant_id, result.rows[index]);
      if (mapped.success === false || mapped.value === null) {
        return null;
      }
      rows.push(mapped.value);
      index = index + 1;
    }
    return rows;
  }
}
