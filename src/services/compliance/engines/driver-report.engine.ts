import type { Database } from "../../../core/database/database.interface";
import { createPreparedStatement } from "../../../core/database/prepared-statement";
import {
  freezeDriverReport,
  type DriverDefectReportInput,
  type DriverReport,
} from "../compliance.interface";
import { mapDriverReportRow } from "../utils/compliance-mapper";
import { normalizeTenantId } from "../utils/compliance-normalizer";

export class DriverReportEngine {
  private readonly tenant_id: string;
  private readonly database: Database;

  constructor(tenant_id: string, database: Database) {
    this.tenant_id = normalizeTenantId(tenant_id);
    this.database = database;
  }

  build(
    tenant_id: string,
    violation_id: string,
    timestamp: string,
    input: DriverDefectReportInput,
  ): DriverReport {
    return freezeDriverReport({
      tenant_id,
      violation_id,
      asset_id: input.asset_id,
      description: input.description,
      severity: input.severity,
      status: "open",
      created_at: timestamp,
      updated_at: timestamp,
      deleted_at: null,
    });
  }

  async insert(report: DriverReport): Promise<void> {
    const statement = createPreparedStatement(
      "INSERT INTO ComplianceViolations (violation_id, tenant_id, asset_id, description, severity, status, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $7, $7, NULL)",
      [
        report.tenant_id,
        report.violation_id,
        report.asset_id,
        report.description,
        report.severity,
        report.status,
        report.created_at,
      ],
    );
    await this.database.execute(statement);
  }

  async load(violation_id: string): Promise<DriverReport | null> {
    if (violation_id === "") {
      return null;
    }
    const statement = createPreparedStatement(
      "SELECT violation_id, tenant_id, asset_id, description, severity, status, created_at, updated_at, deleted_at FROM ComplianceViolations WHERE tenant_id = $1 AND violation_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, violation_id],
    );
    const result = await this.database.execute(statement);
    if (result.rows.length === 0) {
      return null;
    }
    const mapped = mapDriverReportRow(this.tenant_id, result.rows[0]);
    if (mapped.success === false || mapped.value === null) {
      return null;
    }
    return mapped.value;
  }
}
