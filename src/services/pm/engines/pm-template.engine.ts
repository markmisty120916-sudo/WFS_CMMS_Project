import type { Database } from "../../../core/database/database.interface";
import { createPreparedStatement } from "../../../core/database/prepared-statement";
import {
  freezePmTemplate,
  type PmTemplate,
  type PmTemplateWriteInput,
} from "../pm.interface";
import { mapPmTemplateRow } from "../utils/pm-mapper";
import { normalizeTenantId } from "../utils/pm-normalizer";

export class PmTemplateEngine {
  private readonly tenant_id: string;
  private readonly database: Database;

  constructor(tenant_id: string, database: Database) {
    this.tenant_id = normalizeTenantId(tenant_id);
    this.database = database;
  }

  async load(pm_template_id: string): Promise<PmTemplate | null> {
    if (pm_template_id === "") {
      return null;
    }
    const statement = createPreparedStatement(
      "SELECT pm_template_id, tenant_id, name, interval_miles, interval_hours, created_at, updated_at, deleted_at FROM PMTemplates WHERE tenant_id = $1 AND pm_template_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, pm_template_id],
    );
    const result = await this.database.execute(statement);
    if (result.rows.length === 0) {
      return null;
    }
    const mapped = mapPmTemplateRow(this.tenant_id, result.rows[0]);
    if (mapped.success === false || mapped.value === null) {
      return null;
    }
    return mapped.value;
  }

  async loadList(): Promise<readonly PmTemplate[] | null> {
    const statement = createPreparedStatement(
      "SELECT pm_template_id, tenant_id, name, interval_miles, interval_hours, created_at, updated_at, deleted_at FROM PMTemplates WHERE tenant_id = $1 AND deleted_at IS NULL",
      [this.tenant_id],
    );
    const result = await this.database.execute(statement);
    const rows: PmTemplate[] = [];
    let index = 0;
    while (index < result.rows.length) {
      const mapped = mapPmTemplateRow(this.tenant_id, result.rows[index]);
      if (mapped.success === false || mapped.value === null) {
        return null;
      }
      rows.push(mapped.value);
      index = index + 1;
    }
    return rows;
  }

  async insert(template: PmTemplate): Promise<void> {
    const statement = createPreparedStatement(
      "INSERT INTO PMTemplates (pm_template_id, tenant_id, name, interval_miles, interval_hours, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $6, NULL)",
      [
        template.tenant_id,
        template.pm_template_id,
        template.name,
        template.interval_miles,
        template.interval_hours,
        template.created_at,
      ],
    );
    await this.database.execute(statement);
  }

  async update(template: PmTemplate): Promise<void> {
    const statement = createPreparedStatement(
      "UPDATE PMTemplates SET name = $3, interval_miles = $4, interval_hours = $5, updated_at = $6 WHERE tenant_id = $1 AND pm_template_id = $2 AND deleted_at IS NULL",
      [
        template.tenant_id,
        template.pm_template_id,
        template.name,
        template.interval_miles,
        template.interval_hours,
        template.updated_at,
      ],
    );
    await this.database.execute(statement);
  }

  async softDelete(template: PmTemplate): Promise<void> {
    if (template.deleted_at === null) {
      throw new Error("soft delete required");
    }
    const statement = createPreparedStatement(
      "UPDATE PMTemplates SET deleted_at = $3, updated_at = $3 WHERE tenant_id = $1 AND pm_template_id = $2 AND deleted_at IS NULL",
      [template.tenant_id, template.pm_template_id, template.deleted_at],
    );
    await this.database.execute(statement);
  }

  applyWrite(
    tenant_id: string,
    pm_template_id: string,
    timestamp: string,
    input: PmTemplateWriteInput,
    current: PmTemplate | null,
  ): PmTemplate {
    let created_at = timestamp;
    if (current !== null) {
      created_at = current.created_at;
    }
    return freezePmTemplate({
      tenant_id,
      pm_template_id,
      name: input.name,
      interval_miles: input.interval_miles,
      interval_hours: input.interval_hours,
      created_at,
      updated_at: timestamp,
      deleted_at: null,
    });
  }
}
