import type { Database } from "../../../core/database/database.interface";
import { PmTelematicsAdapter } from "../adapters/pm-telematics.adapter";
import { freezePmTrigger, type PmSchedule, type PmTrigger } from "../pm.interface";
import { meterReached, normalizeTenantId } from "../utils/pm-normalizer";
import { PmScheduleEngine } from "./pm-schedule.engine";

export class PmTriggerEngine {
  private readonly tenant_id: string;
  private readonly scheduleEngine: PmScheduleEngine;
  private readonly telematicsAdapter: PmTelematicsAdapter;

  constructor(tenant_id: string, database: Database) {
    this.tenant_id = normalizeTenantId(tenant_id);
    this.scheduleEngine = new PmScheduleEngine(tenant_id, database);
    this.telematicsAdapter = new PmTelematicsAdapter(tenant_id, database);
  }

  async evaluate(schedule: PmSchedule): Promise<PmTrigger | null> {
    const meters = await this.scheduleEngine.loadAssetMeters(schedule.asset_id);
    let mileage = "";
    let hours = "";
    if (meters !== null) {
      mileage = meters.mileage;
      hours = meters.hours;
    }
    const miles_due = meterReached(mileage, schedule.due_miles);
    const hours_due = meterReached(hours, schedule.due_hours);
    const signals = await this.telematicsAdapter.loadSignals(schedule.asset_id);
    if (signals === null) {
      return null;
    }
    let telematics_due = false;
    if (signals.length > 0) {
      telematics_due = true;
    }
    let fired = false;
    if (miles_due === true) {
      fired = true;
    }
    if (hours_due === true) {
      fired = true;
    }
    if (telematics_due === true) {
      fired = true;
    }
    return freezePmTrigger({
      tenant_id: this.tenant_id,
      pm_schedule_id: schedule.pm_schedule_id,
      asset_id: schedule.asset_id,
      miles_due,
      hours_due,
      telematics_due,
      fired,
    });
  }
}
