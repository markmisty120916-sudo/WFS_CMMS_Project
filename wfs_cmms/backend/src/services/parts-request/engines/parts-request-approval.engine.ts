import type { Database } from "../../../core/database/database.interface";
import { createPreparedStatement } from "../../../core/database/prepared-statement";
import {
  freezePartsRequest,
  type PartsRequest,
  type PartsRequestWriteInput,
} from "../parts-request.interface";
import { isPartsRequestOpen } from "../parts-request-rules";
import { mapPartsRequestRow } from "../utils/parts-request-mapper";
import { normalizeTenantId } from "../utils/parts-request-normalizer";

export class PartsRequestApprovalEngine {
  private readonly tenant_id: string;
  private readonly database: Database;

  constructor(tenant_id: string, database: Database) {
    this.tenant_id = normalizeTenantId(tenant_id);
    this.database = database;
  }

  async load(request_id: string): Promise<PartsRequest | null> {
    if (request_id === "") {
      return null;
    }
    const statement = createPreparedStatement(
      "SELECT request_id, tenant_id, workorder_id, part_id, quantity, status, created_at, updated_at, deleted_at FROM PartRequests WHERE tenant_id = $1 AND request_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, request_id],
    );
    const result = await this.database.execute(statement);
    if (result.rows.length === 0) {
      return null;
    }
    const mapped = mapPartsRequestRow(this.tenant_id, result.rows[0]);
    if (mapped.success === false || mapped.value === null) {
      return null;
    }
    return mapped.value;
  }

  async loadByWorkorder(workorder_id: string): Promise<readonly PartsRequest[] | null> {
    let statement;
    if (workorder_id === "") {
      statement = createPreparedStatement(
        "SELECT request_id, tenant_id, workorder_id, part_id, quantity, status, created_at, updated_at, deleted_at FROM PartRequests WHERE tenant_id = $1 AND deleted_at IS NULL",
        [this.tenant_id],
      );
    } else {
      statement = createPreparedStatement(
        "SELECT request_id, tenant_id, workorder_id, part_id, quantity, status, created_at, updated_at, deleted_at FROM PartRequests WHERE tenant_id = $1 AND workorder_id = $2 AND deleted_at IS NULL",
        [this.tenant_id, workorder_id],
      );
    }
    const result = await this.database.execute(statement);
    const rows: PartsRequest[] = [];
    let index = 0;
    while (index < result.rows.length) {
      const mapped = mapPartsRequestRow(this.tenant_id, result.rows[index]);
      if (mapped.success === false || mapped.value === null) {
        return null;
      }
      rows.push(mapped.value);
      index = index + 1;
    }
    return rows;
  }

  async insert(request: PartsRequest): Promise<void> {
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

  async update(request: PartsRequest): Promise<void> {
    const statement = createPreparedStatement(
      "UPDATE PartRequests SET workorder_id = $3, part_id = $4, quantity = $5, status = $6, updated_at = $7 WHERE tenant_id = $1 AND request_id = $2 AND deleted_at IS NULL",
      [
        request.tenant_id,
        request.request_id,
        request.workorder_id,
        request.part_id,
        request.quantity,
        request.status,
        request.updated_at,
      ],
    );
    await this.database.execute(statement);
  }

  async softDelete(request: PartsRequest): Promise<void> {
    if (request.deleted_at === null) {
      throw new Error("soft delete required");
    }
    const statement = createPreparedStatement(
      "UPDATE PartRequests SET deleted_at = $3, updated_at = $3 WHERE tenant_id = $1 AND request_id = $2 AND deleted_at IS NULL",
      [request.tenant_id, request.request_id, request.deleted_at],
    );
    await this.database.execute(statement);
  }

  applyCreate(
    tenant_id: string,
    request_id: string,
    timestamp: string,
    input: PartsRequestWriteInput,
  ): PartsRequest {
    return freezePartsRequest({
      tenant_id,
      request_id,
      workorder_id: input.workorder_id,
      part_id: input.part_id,
      quantity: input.quantity,
      status: "submitted",
      created_at: timestamp,
      updated_at: timestamp,
      deleted_at: null,
    });
  }

  applyUpdate(
    current: PartsRequest,
    timestamp: string,
    input: PartsRequestWriteInput,
  ): PartsRequest | null {
    if (isPartsRequestOpen(current.status) === false) {
      return null;
    }
    return freezePartsRequest({
      tenant_id: current.tenant_id,
      request_id: current.request_id,
      workorder_id: input.workorder_id,
      part_id: input.part_id,
      quantity: input.quantity,
      status: "submitted",
      created_at: current.created_at,
      updated_at: timestamp,
      deleted_at: current.deleted_at,
    });
  }

  applyApproved(current: PartsRequest, timestamp: string): PartsRequest | null {
    if (isPartsRequestOpen(current.status) === false) {
      return null;
    }
    return freezePartsRequest({
      tenant_id: current.tenant_id,
      request_id: current.request_id,
      workorder_id: current.workorder_id,
      part_id: current.part_id,
      quantity: current.quantity,
      status: "approved",
      created_at: current.created_at,
      updated_at: timestamp,
      deleted_at: current.deleted_at,
    });
  }

  applyDenied(current: PartsRequest, timestamp: string): PartsRequest | null {
    if (isPartsRequestOpen(current.status) === false) {
      return null;
    }
    return freezePartsRequest({
      tenant_id: current.tenant_id,
      request_id: current.request_id,
      workorder_id: current.workorder_id,
      part_id: current.part_id,
      quantity: current.quantity,
      status: "denied",
      created_at: current.created_at,
      updated_at: timestamp,
      deleted_at: current.deleted_at,
    });
  }

  applySoftDelete(current: PartsRequest, timestamp: string): PartsRequest {
    return freezePartsRequest({
      tenant_id: current.tenant_id,
      request_id: current.request_id,
      workorder_id: current.workorder_id,
      part_id: current.part_id,
      quantity: current.quantity,
      status: current.status,
      created_at: current.created_at,
      updated_at: timestamp,
      deleted_at: timestamp,
    });
  }
}
