import type { Database } from "../../../core/database/database.interface";
import { createPreparedStatement } from "../../../core/database/prepared-statement";
import {
  freezeDriverDefect,
  freezeDriverDefectPhoto,
  type DriverDefect,
  type DriverDefectPhoto,
  type DriverDefectWriteInput,
} from "../driver-defect.interface";
import { mapDriverDefectPhotoRow, mapDriverDefectRow } from "../utils/driver-defect-mapper";
import { normalizeTenantId } from "../utils/driver-defect-normalizer";

export class DriverDefectIntakeEngine {
  private readonly tenant_id: string;
  private readonly database: Database;

  constructor(tenant_id: string, database: Database) {
    this.tenant_id = normalizeTenantId(tenant_id);
    this.database = database;
  }

  async load(defect_id: string): Promise<DriverDefect | null> {
    if (defect_id === "") {
      return null;
    }
    const statement = createPreparedStatement(
      "SELECT violation_id, tenant_id, asset_id, description, severity, status, created_at, updated_at, deleted_at FROM ComplianceViolations WHERE tenant_id = $1 AND violation_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, defect_id],
    );
    const result = await this.database.execute(statement);
    if (result.rows.length === 0) {
      return null;
    }
    const mapped = mapDriverDefectRow(this.tenant_id, result.rows[0]);
    if (mapped.success === false || mapped.value === null) {
      return null;
    }
    return mapped.value;
  }

  applyCreate(
    tenant_id: string,
    defect_id: string,
    timestamp: string,
    input: DriverDefectWriteInput,
  ): DriverDefect {
    return freezeDriverDefect({
      tenant_id,
      defect_id,
      asset_id: input.asset_id,
      description: input.description,
      severity: input.severity,
      status: "open",
      created_at: timestamp,
      updated_at: timestamp,
      deleted_at: null,
    });
  }

  applyUpdate(
    current: DriverDefect,
    timestamp: string,
    input: DriverDefectWriteInput,
    status: string,
  ): DriverDefect {
    let next_status = current.status;
    if (status !== "") {
      next_status = status;
    }
    return freezeDriverDefect({
      tenant_id: current.tenant_id,
      defect_id: current.defect_id,
      asset_id: input.asset_id,
      description: input.description,
      severity: input.severity,
      status: next_status,
      created_at: current.created_at,
      updated_at: timestamp,
      deleted_at: current.deleted_at,
    });
  }

  applySoftDelete(current: DriverDefect, timestamp: string): DriverDefect {
    return freezeDriverDefect({
      tenant_id: current.tenant_id,
      defect_id: current.defect_id,
      asset_id: current.asset_id,
      description: current.description,
      severity: current.severity,
      status: current.status,
      created_at: current.created_at,
      updated_at: timestamp,
      deleted_at: timestamp,
    });
  }

  async insert(defect: DriverDefect): Promise<void> {
    const statement = createPreparedStatement(
      "INSERT INTO ComplianceViolations (violation_id, tenant_id, asset_id, description, severity, status, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $7, $7, NULL)",
      [
        defect.tenant_id,
        defect.defect_id,
        defect.asset_id,
        defect.description,
        defect.severity,
        defect.status,
        defect.created_at,
      ],
    );
    await this.database.execute(statement);
  }

  async insertWorkorder(defect: DriverDefect, created_by: string): Promise<void> {
    const statement = createPreparedStatement(
      "INSERT INTO Workorders (workorder_id, tenant_id, asset_id, source, description, severity, routing_tech_id, routing_bay_id, scheduled_start, scheduled_end, status, created_by, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $13, NULL)",
      [
        defect.tenant_id,
        defect.defect_id,
        defect.asset_id,
        "driver",
        defect.description,
        defect.severity,
        "",
        "",
        "",
        "",
        defect.status,
        created_by,
        defect.created_at,
      ],
    );
    await this.database.execute(statement);
  }

  async update(defect: DriverDefect): Promise<void> {
    const statement = createPreparedStatement(
      "UPDATE ComplianceViolations SET asset_id = $3, description = $4, severity = $5, status = $6, updated_at = $7 WHERE tenant_id = $1 AND violation_id = $2 AND deleted_at IS NULL",
      [
        defect.tenant_id,
        defect.defect_id,
        defect.asset_id,
        defect.description,
        defect.severity,
        defect.status,
        defect.updated_at,
      ],
    );
    await this.database.execute(statement);
  }

  async updateWorkorder(defect: DriverDefect): Promise<void> {
    const statement = createPreparedStatement(
      "UPDATE Workorders SET asset_id = $3, description = $4, severity = $5, status = $6, updated_at = $7 WHERE tenant_id = $1 AND workorder_id = $2 AND deleted_at IS NULL",
      [
        defect.tenant_id,
        defect.defect_id,
        defect.asset_id,
        defect.description,
        defect.severity,
        defect.status,
        defect.updated_at,
      ],
    );
    await this.database.execute(statement);
  }

  async softDelete(defect: DriverDefect): Promise<void> {
    if (defect.deleted_at === null) {
      throw new Error("soft delete required");
    }
    const statement = createPreparedStatement(
      "UPDATE ComplianceViolations SET deleted_at = $3, updated_at = $3 WHERE tenant_id = $1 AND violation_id = $2 AND deleted_at IS NULL",
      [defect.tenant_id, defect.defect_id, defect.deleted_at],
    );
    await this.database.execute(statement);
  }

  buildPhoto(
    tenant_id: string,
    photo_id: string,
    workorder_id: string,
    user_id: string,
    photo_url: string,
    timestamp: string,
  ): DriverDefectPhoto | null {
    if (photo_url === "") {
      return null;
    }
    return freezeDriverDefectPhoto({
      tenant_id,
      photo_id,
      workorder_id,
      user_id,
      photo_url,
      created_at: timestamp,
      updated_at: timestamp,
      deleted_at: null,
    });
  }

  async insertPhoto(photo: DriverDefectPhoto): Promise<void> {
    const statement = createPreparedStatement(
      "INSERT INTO WorkorderPhotos (photo_id, tenant_id, workorder_id, user_id, photo_url, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $6, NULL)",
      [
        photo.tenant_id,
        photo.photo_id,
        photo.workorder_id,
        photo.user_id,
        photo.photo_url,
        photo.created_at,
      ],
    );
    await this.database.execute(statement);
  }

  async loadPhotos(workorder_id: string): Promise<readonly DriverDefectPhoto[] | null> {
    const statement = createPreparedStatement(
      "SELECT photo_id, tenant_id, workorder_id, user_id, photo_url, created_at, updated_at, deleted_at FROM WorkorderPhotos WHERE tenant_id = $1 AND workorder_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, workorder_id],
    );
    const result = await this.database.execute(statement);
    const rows: DriverDefectPhoto[] = [];
    let index = 0;
    while (index < result.rows.length) {
      const mapped = mapDriverDefectPhotoRow(this.tenant_id, result.rows[index]);
      if (mapped.success === false || mapped.value === null) {
        return null;
      }
      rows.push(mapped.value);
      index = index + 1;
    }
    return rows;
  }
}
