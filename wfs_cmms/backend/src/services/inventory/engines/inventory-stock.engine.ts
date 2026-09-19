import type { Database } from "../../../core/database/database.interface";
import { createPreparedStatement } from "../../../core/database/prepared-statement";
import {
  freezePart,
  freezeStockAdjustment,
  type Part,
  type PartWriteInput,
  type StockAdjustment,
} from "../inventory.interface";
import { mapPartRow } from "../utils/inventory-mapper";
import { applyDelta, normalizeTenantId } from "../utils/inventory-normalizer";

export class InventoryStockEngine {
  private readonly tenant_id: string;
  private readonly database: Database;

  constructor(tenant_id: string, database: Database) {
    this.tenant_id = normalizeTenantId(tenant_id);
    this.database = database;
  }

  async load(part_id: string): Promise<Part | null> {
    if (part_id === "") {
      return null;
    }
    const statement = createPreparedStatement(
      "SELECT part_id, tenant_id, name, description, quantity, location, created_at, updated_at, deleted_at FROM Parts WHERE tenant_id = $1 AND part_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, part_id],
    );
    const result = await this.database.execute(statement);
    if (result.rows.length === 0) {
      return null;
    }
    const mapped = mapPartRow(this.tenant_id, result.rows[0]);
    if (mapped.success === false || mapped.value === null) {
      return null;
    }
    return mapped.value;
  }

  async loadList(): Promise<readonly Part[] | null> {
    const statement = createPreparedStatement(
      "SELECT part_id, tenant_id, name, description, quantity, location, created_at, updated_at, deleted_at FROM Parts WHERE tenant_id = $1 AND deleted_at IS NULL",
      [this.tenant_id],
    );
    const result = await this.database.execute(statement);
    const rows: Part[] = [];
    let index = 0;
    while (index < result.rows.length) {
      const mapped = mapPartRow(this.tenant_id, result.rows[index]);
      if (mapped.success === false || mapped.value === null) {
        return null;
      }
      rows.push(mapped.value);
      index = index + 1;
    }
    return rows;
  }

  async insert(part: Part): Promise<void> {
    const statement = createPreparedStatement(
      "INSERT INTO Parts (part_id, tenant_id, name, description, quantity, location, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $7, $7, NULL)",
      [
        part.tenant_id,
        part.part_id,
        part.name,
        part.description,
        part.quantity,
        part.location,
        part.created_at,
      ],
    );
    await this.database.execute(statement);
  }

  async update(part: Part): Promise<void> {
    const statement = createPreparedStatement(
      "UPDATE Parts SET name = $3, description = $4, quantity = $5, location = $6, updated_at = $7 WHERE tenant_id = $1 AND part_id = $2 AND deleted_at IS NULL",
      [
        part.tenant_id,
        part.part_id,
        part.name,
        part.description,
        part.quantity,
        part.location,
        part.updated_at,
      ],
    );
    await this.database.execute(statement);
  }

  async softDelete(part: Part): Promise<void> {
    if (part.deleted_at === null) {
      throw new Error("soft delete required");
    }
    const statement = createPreparedStatement(
      "UPDATE Parts SET deleted_at = $3, updated_at = $3 WHERE tenant_id = $1 AND part_id = $2 AND deleted_at IS NULL",
      [part.tenant_id, part.part_id, part.deleted_at],
    );
    await this.database.execute(statement);
  }

  applyWrite(
    tenant_id: string,
    part_id: string,
    timestamp: string,
    input: PartWriteInput,
    current: Part | null,
  ): Part {
    let created_at = timestamp;
    if (current !== null) {
      created_at = current.created_at;
    }
    return freezePart({
      tenant_id,
      part_id,
      name: input.name,
      description: input.description,
      quantity: input.quantity,
      location: input.location,
      created_at,
      updated_at: timestamp,
      deleted_at: null,
    });
  }

  applySoftDelete(current: Part, timestamp: string): Part {
    return freezePart({
      tenant_id: current.tenant_id,
      part_id: current.part_id,
      name: current.name,
      description: current.description,
      quantity: current.quantity,
      location: current.location,
      created_at: current.created_at,
      updated_at: timestamp,
      deleted_at: timestamp,
    });
  }

  applyAdjustment(
    current: Part,
    timestamp: string,
    delta: string,
    reason: string,
  ): { part: Part; adjustment: StockAdjustment } | null {
    const next_quantity = applyDelta(current.quantity, delta);
    if (next_quantity === null) {
      return null;
    }
    const part = freezePart({
      tenant_id: current.tenant_id,
      part_id: current.part_id,
      name: current.name,
      description: current.description,
      quantity: next_quantity,
      location: current.location,
      created_at: current.created_at,
      updated_at: timestamp,
      deleted_at: current.deleted_at,
    });
    const adjustment = freezeStockAdjustment({
      tenant_id: current.tenant_id,
      part_id: current.part_id,
      previous_quantity: current.quantity,
      new_quantity: next_quantity,
      delta,
      reason,
    });
    return { part, adjustment };
  }
}
