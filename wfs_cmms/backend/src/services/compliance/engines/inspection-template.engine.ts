import type { Database } from "../../../core/database/database.interface";
import { createPreparedStatement } from "../../../core/database/prepared-statement";
import {
  freezeInspectionTemplate,
  type InspectionTemplate,
  type InspectionTemplateWriteInput,
} from "../compliance.interface";
import { mapInspectionTemplateRow } from "../utils/compliance-mapper";
import { normalizeTenantId } from "../utils/compliance-normalizer";

export class InspectionTemplateEngine {
  private readonly tenant_id: string;
  private readonly database: Database;

  constructor(tenant_id: string, database: Database) {
    this.tenant_id = normalizeTenantId(tenant_id);
    this.database = database;
  }

  async load(inspection_id: string): Promise<InspectionTemplate | null> {
    if (inspection_id === "") {
      return null;
    }
    const statement = createPreparedStatement(
      "SELECT inspection_id, tenant_id, asset_id, type, status, created_at, updated_at, deleted_at FROM ComplianceInspections WHERE tenant_id = $1 AND inspection_id = $2 AND status = $3 AND deleted_at IS NULL",
      [this.tenant_id, inspection_id, "template"],
    );
    const result = await this.database.execute(statement);
    if (result.rows.length === 0) {
      return null;
    }
    const mapped = mapInspectionTemplateRow(this.tenant_id, result.rows[0]);
    if (mapped.success === false || mapped.value === null) {
      return null;
    }
    return mapped.value;
  }

  async loadList(): Promise<readonly InspectionTemplate[] | null> {
    const statement = createPreparedStatement(
      "SELECT inspection_id, tenant_id, asset_id, type, status, created_at, updated_at, deleted_at FROM ComplianceInspections WHERE tenant_id = $1 AND status = $2 AND deleted_at IS NULL",
      [this.tenant_id, "template"],
    );
    const result = await this.database.execute(statement);
    const rows: InspectionTemplate[] = [];
    let index = 0;
    while (index < result.rows.length) {
      const mapped = mapInspectionTemplateRow(this.tenant_id, result.rows[index]);
      if (mapped.success === false || mapped.value === null) {
        return null;
      }
      rows.push(mapped.value);
      index = index + 1;
    }
    return rows;
  }

  async insert(template: InspectionTemplate): Promise<void> {
    const statement = createPreparedStatement(
      "INSERT INTO ComplianceInspections (inspection_id, tenant_id, asset_id, type, status, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $6, NULL)",
      [
        template.tenant_id,
        template.inspection_id,
        template.asset_id,
        template.type,
        template.status,
        template.created_at,
      ],
    );
    await this.database.execute(statement);
  }

  async update(template: InspectionTemplate): Promise<void> {
    const statement = createPreparedStatement(
      "UPDATE ComplianceInspections SET type = $3, updated_at = $4 WHERE tenant_id = $1 AND inspection_id = $2 AND status = $5 AND deleted_at IS NULL",
      [template.tenant_id, template.inspection_id, template.type, template.updated_at, "template"],
    );
    await this.database.execute(statement);
  }

  async softDelete(template: InspectionTemplate): Promise<void> {
    if (template.deleted_at === null) {
      throw new Error("soft delete required");
    }
    const statement = createPreparedStatement(
      "UPDATE ComplianceInspections SET deleted_at = $3, updated_at = $3 WHERE tenant_id = $1 AND inspection_id = $2 AND status = $4 AND deleted_at IS NULL",
      [template.tenant_id, template.inspection_id, template.deleted_at, "template"],
    );
    await this.database.execute(statement);
  }

  applyWrite(
    tenant_id: string,
    inspection_id: string,
    timestamp: string,
    input: InspectionTemplateWriteInput,
    current: InspectionTemplate | null,
  ): InspectionTemplate {
    let created_at = timestamp;
    if (current !== null) {
      created_at = current.created_at;
    }
    return freezeInspectionTemplate({
      tenant_id,
      inspection_id,
      asset_id: "",
      type: input.type,
      status: "template",
      created_at,
      updated_at: timestamp,
      deleted_at: null,
    });
  }
}
