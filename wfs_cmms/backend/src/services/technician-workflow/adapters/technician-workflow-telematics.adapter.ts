import type { Database } from "../../../core/database/database.interface";
import { createPreparedStatement } from "../../../core/database/prepared-statement";
import type { TelematicsClusterLevel } from "../../../aimi/predictive/predictive-inputs.interface";
import type { TelematicsFaultLevel } from "../../../aimi/severity/severity-inputs.interface";
import { asFieldString, normalizeTenantId } from "../utils/technician-workflow-normalizer";

export type WorkflowTelematicsSignal = {
  readonly tenant_id: string;
  readonly asset_id: string;
  readonly fault_code: string;
  readonly severity: string;
};

export class TechnicianWorkflowTelematicsAdapter {
  private readonly tenant_id: string;
  private readonly database: Database;

  constructor(tenant_id: string, database: Database) {
    this.tenant_id = normalizeTenantId(tenant_id);
    this.database = database;
  }

  async loadSignals(asset_id: string): Promise<readonly WorkflowTelematicsSignal[] | null> {
    if (asset_id === "") {
      return null;
    }
    const statement = createPreparedStatement(
      "SELECT tenant_id, asset_id, fault_code, severity FROM AssetTelematics WHERE tenant_id = $1 AND asset_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, asset_id],
    );
    const result = await this.database.execute(statement);
    const rows: WorkflowTelematicsSignal[] = [];
    let index = 0;
    while (index < result.rows.length) {
      const row = result.rows[index];
      const record_tenant_id = asFieldString(row.tenant_id);
      if (record_tenant_id !== this.tenant_id) {
        return null;
      }
      rows.push(
        Object.freeze({
          tenant_id: record_tenant_id,
          asset_id: asFieldString(row.asset_id),
          fault_code: asFieldString(row.fault_code),
          severity: asFieldString(row.severity),
        }),
      );
      index = index + 1;
    }
    return rows;
  }

  faultLevel(signals: readonly WorkflowTelematicsSignal[]): TelematicsFaultLevel {
    let index = 0;
    let level: TelematicsFaultLevel = "none";
    while (index < signals.length) {
      const severity = signals[index].severity;
      if (severity === "critical") {
        return "critical";
      }
      if (severity === "major") {
        level = "major";
      }
      if (severity === "moderate") {
        if (level === "none") {
          level = "moderate";
        }
        if (level === "minor") {
          level = "moderate";
        }
      }
      if (severity === "minor") {
        if (level === "none") {
          level = "minor";
        }
      }
      index = index + 1;
    }
    return level;
  }

  clusterLevel(signals: readonly WorkflowTelematicsSignal[]): TelematicsClusterLevel {
    return this.faultLevel(signals);
  }
}
