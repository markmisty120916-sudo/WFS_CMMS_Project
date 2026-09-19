import type { DtoRole } from "../../core/dto/base.dto";
import type { ErrorType } from "../../core/errors/error-types";

export type Asset = {
  readonly tenant_id: string;
  readonly asset_id: string;
  readonly vin: string;
  readonly unit_number: string;
  readonly make: string;
  readonly model: string;
  readonly year: string;
  readonly mileage: string;
  readonly hours: string;
  readonly status: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type AssetMeters = {
  readonly tenant_id: string;
  readonly asset_id: string;
  readonly mileage: string;
  readonly hours: string;
};

export type AssetHealth = {
  readonly tenant_id: string;
  readonly health_id: string;
  readonly asset_id: string;
  readonly health_score: string;
  readonly predictive_score: string;
  readonly last_update: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type AssetTelematics = {
  readonly tenant_id: string;
  readonly telematics_id: string;
  readonly asset_id: string;
  readonly fault_code: string;
  readonly fault_description: string;
  readonly severity: string;
  readonly timestamp: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type AssetPmSchedule = {
  readonly tenant_id: string;
  readonly pm_schedule_id: string;
  readonly asset_id: string;
  readonly pm_template_id: string;
  readonly due_miles: string;
  readonly due_hours: string;
  readonly status: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type AssetPmHistory = {
  readonly tenant_id: string;
  readonly pm_history_id: string;
  readonly asset_id: string;
  readonly pm_template_id: string;
  readonly completed_at: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type AssetWorkorder = {
  readonly tenant_id: string;
  readonly workorder_id: string;
  readonly asset_id: string;
  readonly source: string;
  readonly description: string;
  readonly severity: string;
  readonly routing_tech_id: string;
  readonly routing_bay_id: string;
  readonly scheduled_start: string;
  readonly scheduled_end: string;
  readonly status: string;
  readonly created_by: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type AssetDiagnostic = {
  readonly tenant_id: string;
  readonly diagnostic_id: string;
  readonly workorder_id: string;
  readonly asset_id: string;
  readonly steps_taken: string;
  readonly steps_skipped: string;
  readonly outcome: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type AssetReadiness = {
  readonly tenant_id: string;
  readonly asset_id: string;
  readonly asset_status: string;
  readonly health_score: string;
  readonly predictive_score: string;
  readonly telematics_count: string;
  readonly pm_schedule_count: string;
};

export type AssetHistory = {
  readonly tenant_id: string;
  readonly asset_id: string;
  readonly workorders: readonly AssetWorkorder[];
  readonly pm_history: readonly AssetPmHistory[];
  readonly diagnostics: readonly AssetDiagnostic[];
};

export type AssetProfile = {
  readonly tenant_id: string;
  readonly asset: Asset;
  readonly meters: AssetMeters;
  readonly health: AssetHealth | null;
  readonly telematics: readonly AssetTelematics[];
  readonly pm_schedules: readonly AssetPmSchedule[];
  readonly readiness: AssetReadiness;
  readonly history: AssetHistory;
};

export type AssetListQuery = {
  readonly status: string;
  readonly group_id: string;
};

export type AssetWriteInput = {
  readonly asset_number: string;
  readonly vin: string;
  readonly make: string;
  readonly model: string;
  readonly year: string;
  readonly type: string;
  readonly location: string;
};

export type AssetListResult = {
  readonly tenant_id: string;
  readonly role: DtoRole;
  readonly assets: readonly Asset[];
};

export type AssetBuildResult<T> =
  | { success: true; error_code: "none"; value: T }
  | { success: false; error_code: ErrorType; value: null };

export function freezeAsset(asset: Asset): Asset {
  return Object.freeze({
    tenant_id: asset.tenant_id,
    asset_id: asset.asset_id,
    vin: asset.vin,
    unit_number: asset.unit_number,
    make: asset.make,
    model: asset.model,
    year: asset.year,
    mileage: asset.mileage,
    hours: asset.hours,
    status: asset.status,
    created_at: asset.created_at,
    updated_at: asset.updated_at,
    deleted_at: asset.deleted_at,
  });
}

export function freezeAssetMeters(meters: AssetMeters): AssetMeters {
  return Object.freeze({
    tenant_id: meters.tenant_id,
    asset_id: meters.asset_id,
    mileage: meters.mileage,
    hours: meters.hours,
  });
}

export function freezeAssetHealth(health: AssetHealth): AssetHealth {
  return Object.freeze({
    tenant_id: health.tenant_id,
    health_id: health.health_id,
    asset_id: health.asset_id,
    health_score: health.health_score,
    predictive_score: health.predictive_score,
    last_update: health.last_update,
    created_at: health.created_at,
    updated_at: health.updated_at,
    deleted_at: health.deleted_at,
  });
}

export function freezeAssetTelematics(row: AssetTelematics): AssetTelematics {
  return Object.freeze({
    tenant_id: row.tenant_id,
    telematics_id: row.telematics_id,
    asset_id: row.asset_id,
    fault_code: row.fault_code,
    fault_description: row.fault_description,
    severity: row.severity,
    timestamp: row.timestamp,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  });
}

export function freezeAssetPmSchedule(row: AssetPmSchedule): AssetPmSchedule {
  return Object.freeze({
    tenant_id: row.tenant_id,
    pm_schedule_id: row.pm_schedule_id,
    asset_id: row.asset_id,
    pm_template_id: row.pm_template_id,
    due_miles: row.due_miles,
    due_hours: row.due_hours,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  });
}

export function freezeAssetPmHistory(row: AssetPmHistory): AssetPmHistory {
  return Object.freeze({
    tenant_id: row.tenant_id,
    pm_history_id: row.pm_history_id,
    asset_id: row.asset_id,
    pm_template_id: row.pm_template_id,
    completed_at: row.completed_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  });
}

export function freezeAssetWorkorder(row: AssetWorkorder): AssetWorkorder {
  return Object.freeze({
    tenant_id: row.tenant_id,
    workorder_id: row.workorder_id,
    asset_id: row.asset_id,
    source: row.source,
    description: row.description,
    severity: row.severity,
    routing_tech_id: row.routing_tech_id,
    routing_bay_id: row.routing_bay_id,
    scheduled_start: row.scheduled_start,
    scheduled_end: row.scheduled_end,
    status: row.status,
    created_by: row.created_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  });
}

export function freezeAssetDiagnostic(row: AssetDiagnostic): AssetDiagnostic {
  return Object.freeze({
    tenant_id: row.tenant_id,
    diagnostic_id: row.diagnostic_id,
    workorder_id: row.workorder_id,
    asset_id: row.asset_id,
    steps_taken: row.steps_taken,
    steps_skipped: row.steps_skipped,
    outcome: row.outcome,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  });
}

export function freezeAssetReadiness(row: AssetReadiness): AssetReadiness {
  return Object.freeze({
    tenant_id: row.tenant_id,
    asset_id: row.asset_id,
    asset_status: row.asset_status,
    health_score: row.health_score,
    predictive_score: row.predictive_score,
    telematics_count: row.telematics_count,
    pm_schedule_count: row.pm_schedule_count,
  });
}

function freezeWorkorders(rows: readonly AssetWorkorder[]): readonly AssetWorkorder[] {
  const copy: AssetWorkorder[] = [];
  let index = 0;
  while (index < rows.length) {
    copy.push(rows[index]);
    index = index + 1;
  }
  return Object.freeze(copy);
}

function freezePmHistory(rows: readonly AssetPmHistory[]): readonly AssetPmHistory[] {
  const copy: AssetPmHistory[] = [];
  let index = 0;
  while (index < rows.length) {
    copy.push(rows[index]);
    index = index + 1;
  }
  return Object.freeze(copy);
}

function freezeDiagnostics(rows: readonly AssetDiagnostic[]): readonly AssetDiagnostic[] {
  const copy: AssetDiagnostic[] = [];
  let index = 0;
  while (index < rows.length) {
    copy.push(rows[index]);
    index = index + 1;
  }
  return Object.freeze(copy);
}

function freezeTelematics(rows: readonly AssetTelematics[]): readonly AssetTelematics[] {
  const copy: AssetTelematics[] = [];
  let index = 0;
  while (index < rows.length) {
    copy.push(rows[index]);
    index = index + 1;
  }
  return Object.freeze(copy);
}

function freezePmSchedules(rows: readonly AssetPmSchedule[]): readonly AssetPmSchedule[] {
  const copy: AssetPmSchedule[] = [];
  let index = 0;
  while (index < rows.length) {
    copy.push(rows[index]);
    index = index + 1;
  }
  return Object.freeze(copy);
}

export function freezeAssetHistory(history: AssetHistory): AssetHistory {
  return Object.freeze({
    tenant_id: history.tenant_id,
    asset_id: history.asset_id,
    workorders: freezeWorkorders(history.workorders),
    pm_history: freezePmHistory(history.pm_history),
    diagnostics: freezeDiagnostics(history.diagnostics),
  });
}

export function freezeAssetProfile(profile: AssetProfile): AssetProfile {
  return Object.freeze({
    tenant_id: profile.tenant_id,
    asset: profile.asset,
    meters: profile.meters,
    health: profile.health,
    telematics: freezeTelematics(profile.telematics),
    pm_schedules: freezePmSchedules(profile.pm_schedules),
    readiness: profile.readiness,
    history: profile.history,
  });
}

export function freezeAssetListResult(result: AssetListResult): AssetListResult {
  const assets: Asset[] = [];
  let index = 0;
  while (index < result.assets.length) {
    assets.push(result.assets[index]);
    index = index + 1;
  }
  return Object.freeze({
    tenant_id: result.tenant_id,
    role: result.role,
    assets: Object.freeze(assets),
  });
}
