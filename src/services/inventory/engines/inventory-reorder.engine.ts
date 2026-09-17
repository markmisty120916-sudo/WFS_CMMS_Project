import type { Database } from "../../../core/database/database.interface";
import { createPreparedStatement } from "../../../core/database/prepared-statement";
import {
  freezePartRequest,
  freezeReorder,
  type Part,
  type PartRequest,
  type Reorder,
  type ReorderInput,
} from "../inventory.interface";
import { mapPartRequestRow } from "../utils/inventory-mapper";
import { isAtOrBelow, normalizeTenantId } from "../utils/inventory-normalizer";

export class InventoryReorderEngine {
  private readonly tenant_id: string;
  private readonly database: Database;

  constructor(tenant_id: string, database: Database) {
    this.tenant_id = normalizeTenantId(tenant_id);
    this.database = database;
  }

  needed(part: Part, reorder_point: string): boolean {
    return isAtOrBelow(part.quantity, reorder_point);
  }

  build(
    tenant_id: string,
    request_id: string,
    timestamp: string,
    part: Part,
    input: ReorderInput,
  ): { reorder: Reorder; request: PartRequest } {
    let workorder_id = input.workorder_id;
    if (workorder_id === "") {
      workorder_id = part.part_id;
    }
    const request = freezePartRequest({
      tenant_id,
      request_id,
      workorder_id,
      part_id: part.part_id,
      quantity: input.quantity,
      status: "reorder",
      created_at: timestamp,
      updated_at: timestamp,
      deleted_at: null,
    });
    const reorder = freezeReorder({
      tenant_id,
      request_id,
      part_id: part.part_id,
      quantity: input.quantity,
      vendor_name: input.vendor_name,
      needed: this.needed(part, input.reorder_point),
    });
    return { reorder, request };
  }

  async insert(request: PartRequest): Promise<void> {
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

  async loadByWorkorder(workorder_id: string): Promise<readonly PartRequest[] | null> {
    if (workorder_id === "") {
      return null;
    }
    const statement = createPreparedStatement(
      "SELECT request_id, tenant_id, workorder_id, part_id, quantity, status, created_at, updated_at, deleted_at FROM PartRequests WHERE tenant_id = $1 AND workorder_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, workorder_id],
    );
    const result = await this.database.execute(statement);
    const rows: PartRequest[] = [];
    let index = 0;
    while (index < result.rows.length) {
      const mapped = mapPartRequestRow(this.tenant_id, result.rows[index]);
      if (mapped.success === false || mapped.value === null) {
        return null;
      }
      rows.push(mapped.value);
      index = index + 1;
    }
    return rows;
  }
}
