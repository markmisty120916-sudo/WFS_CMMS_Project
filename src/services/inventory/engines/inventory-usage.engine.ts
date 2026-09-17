import type { Database } from "../../../core/database/database.interface";
import { createPreparedStatement } from "../../../core/database/prepared-statement";
import {
  freezePartRequest,
  freezePartUsage,
  type Part,
  type PartRequest,
  type PartUsage,
  type StockAdjustment,
} from "../inventory.interface";
import { mapPartUsageRow } from "../utils/inventory-mapper";
import { asFiniteNumber, normalizeTenantId } from "../utils/inventory-normalizer";

export class InventoryUsageEngine {
  private readonly tenant_id: string;
  private readonly database: Database;

  constructor(tenant_id: string, database: Database) {
    this.tenant_id = normalizeTenantId(tenant_id);
    this.database = database;
  }

  consumedQuantity(adjustment: StockAdjustment): string {
    const change = asFiniteNumber(adjustment.delta);
    if (change === null) {
      return "0";
    }
    if (change >= 0) {
      return "0";
    }
    return String(0 - change);
  }

  buildUsage(
    tenant_id: string,
    part_usage_id: string,
    timestamp: string,
    part: Part,
    workorder_id: string,
    quantity: string,
  ): PartUsage | null {
    if (workorder_id === "") {
      return null;
    }
    if (quantity === "0") {
      return null;
    }
    return freezePartUsage({
      tenant_id,
      part_usage_id,
      workorder_id,
      part_id: part.part_id,
      quantity,
      created_at: timestamp,
      updated_at: timestamp,
      deleted_at: null,
    });
  }

  buildUsageRequest(
    tenant_id: string,
    request_id: string,
    timestamp: string,
    part: Part,
    workorder_id: string,
    quantity: string,
  ): PartRequest | null {
    if (workorder_id === "") {
      return null;
    }
    if (quantity === "0") {
      return null;
    }
    return freezePartRequest({
      tenant_id,
      request_id,
      workorder_id,
      part_id: part.part_id,
      quantity,
      status: "usage",
      created_at: timestamp,
      updated_at: timestamp,
      deleted_at: null,
    });
  }

  async insertUsage(usage: PartUsage): Promise<void> {
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

  async insertUsageRequest(request: PartRequest): Promise<void> {
    const statement = createPreparedStatement(
      "INSERT INTO PartRequests (request_id, tenant_id, workorder_id, part_id, quantity, status, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $7, $7, NULL)",
      [
        request.tenant_id,
        request.request_id,
        request.workorder_id,
        request.part_id,
        request.quantity,
        request.status,
        request.created_at,
      ],
    );
    await this.database.execute(statement);
  }

  async loadByPart(part_id: string): Promise<readonly PartUsage[] | null> {
    if (part_id === "") {
      return null;
    }
    const statement = createPreparedStatement(
      "SELECT part_usage_id, tenant_id, workorder_id, part_id, quantity, created_at, updated_at, deleted_at FROM WorkorderParts WHERE tenant_id = $1 AND part_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, part_id],
    );
    const result = await this.database.execute(statement);
    const rows: PartUsage[] = [];
    let index = 0;
    while (index < result.rows.length) {
      const mapped = mapPartUsageRow(this.tenant_id, result.rows[index]);
      if (mapped.success === false || mapped.value === null) {
        return null;
      }
      rows.push(mapped.value);
      index = index + 1;
    }
    return rows;
  }
}
