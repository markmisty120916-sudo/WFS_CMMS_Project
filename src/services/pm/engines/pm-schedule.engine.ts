import type { Database } from "../../../core/database/database.interface";
import {
  createPreparedStatement,
  type PreparedStatement,
} from "../../../core/database/prepared-statement";
import {
  freezePmSchedule,
  type PmInstanceWriteInput,
  type PmSchedule,
  type PmTemplate,
} from "../pm.interface";
import { mapPmScheduleRow } from "../utils/pm-mapper";
import { addMeter, asFieldString, normalizeTenantId } from "../utils/pm-normalizer";

export class PmScheduleEngine {
  private readonly tenant_id: string;
  private readonly database: Database;

  constructor(tenant_id: string, database: Database) {
    this.tenant_id = normalizeTenantId(tenant_id);
    this.database = database;
  }

  async load(pm_schedule_id: string): Promise<PmSchedule | null> {
    if (pm_schedule_id === "") {
      return null;
    }
    const statement = createPreparedStatement(
      "SELECT pm_schedule_id, tenant_id, asset_id, pm_template_id, due_miles, due_hours, status, created_at, updated_at, deleted_at FROM PMSchedule WHERE tenant_id = $1 AND pm_schedule_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, pm_schedule_id],
    );
    const result = await this.database.execute(statement);
    if (result.rows.length === 0) {
      return null;
    }
    const mapped = mapPmScheduleRow(this.tenant_id, result.rows[0]);
    if (mapped.success === false || mapped.value === null) {
      return null;
    }
    return mapped.value;
  }

  async loadByAsset(asset_id: string): Promise<readonly PmSchedule[] | null> {
    let statement: PreparedStatement;
    if (asset_id === "") {
      statement = createPreparedStatement(
        "SELECT pm_schedule_id, tenant_id, asset_id, pm_template_id, due_miles, due_hours, status, created_at, updated_at, deleted_at FROM PMSchedule WHERE tenant_id = $1 AND deleted_at IS NULL",
        [this.tenant_id],
      );
    } else {
      statement = createPreparedStatement(
        "SELECT pm_schedule_id, tenant_id, asset_id, pm_template_id, due_miles, due_hours, status, created_at, updated_at, deleted_at FROM PMSchedule WHERE tenant_id = $1 AND asset_id = $2 AND deleted_at IS NULL",
        [this.tenant_id, asset_id],
      );
    }
    const result = await this.database.execute(statement);
    const rows: PmSchedule[] = [];
    let index = 0;
    while (index < result.rows.length) {
      const mapped = mapPmScheduleRow(this.tenant_id, result.rows[index]);
      if (mapped.success === false || mapped.value === null) {
        return null;
      }
      rows.push(mapped.value);
      index = index + 1;
    }
    return rows;
  }

  async insert(schedule: PmSchedule): Promise<void> {
    const statement = createPreparedStatement(
      "INSERT INTO PMSchedule (pm_schedule_id, tenant_id, asset_id, pm_template_id, due_miles, due_hours, status, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $7, $8, $8, NULL)",
      [
        schedule.tenant_id,
        schedule.pm_schedule_id,
        schedule.asset_id,
        schedule.pm_template_id,
        schedule.due_miles,
        schedule.due_hours,
        schedule.status,
        schedule.created_at,
      ],
    );
    await this.database.execute(statement);
  }

  async markCompleted(schedule: PmSchedule, timestamp: string): Promise<PmSchedule> {
    const next = freezePmSchedule({
      tenant_id: schedule.tenant_id,
      pm_schedule_id: schedule.pm_schedule_id,
      asset_id: schedule.asset_id,
      pm_template_id: schedule.pm_template_id,
      due_miles: schedule.due_miles,
      due_hours: schedule.due_hours,
      status: "completed",
      created_at: schedule.created_at,
      updated_at: timestamp,
      deleted_at: schedule.deleted_at,
    });
    const statement = createPreparedStatement(
      "UPDATE PMSchedule SET status = $3, updated_at = $4 WHERE tenant_id = $1 AND pm_schedule_id = $2 AND deleted_at IS NULL",
      [next.tenant_id, next.pm_schedule_id, next.status, next.updated_at],
    );
    await this.database.execute(statement);
    return next;
  }

  async loadAssetMeters(asset_id: string): Promise<{ mileage: string; hours: string } | null> {
    const statement = createPreparedStatement(
      "SELECT tenant_id, mileage, hours FROM Assets WHERE tenant_id = $1 AND asset_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, asset_id],
    );
    const result = await this.database.execute(statement);
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    if (asFieldString(row.tenant_id) !== this.tenant_id) {
      return null;
    }
    return {
      mileage: asFieldString(row.mileage),
      hours: asFieldString(row.hours),
    };
  }

  buildInstance(
    tenant_id: string,
    pm_schedule_id: string,
    timestamp: string,
    input: PmInstanceWriteInput,
    template: PmTemplate,
    meters: { mileage: string; hours: string } | null,
  ): PmSchedule {
    let due_miles = input.due_miles;
    let due_hours = input.due_hours;
    if (due_miles === "") {
      if (meters !== null) {
        due_miles = addMeter(meters.mileage, template.interval_miles);
      } else {
        due_miles = template.interval_miles;
      }
    }
    if (due_hours === "") {
      if (meters !== null) {
        due_hours = addMeter(meters.hours, template.interval_hours);
      } else {
        due_hours = template.interval_hours;
      }
    }
    return freezePmSchedule({
      tenant_id,
      pm_schedule_id,
      asset_id: input.asset_id,
      pm_template_id: template.pm_template_id,
      due_miles,
      due_hours,
      status: "scheduled",
      created_at: timestamp,
      updated_at: timestamp,
      deleted_at: null,
    });
  }
}
