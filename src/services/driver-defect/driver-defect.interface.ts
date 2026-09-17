import type { DtoRole } from "../../core/dto/base.dto";
import type { ErrorType } from "../../core/errors/error-types";
import type { DiagnosticsOutput } from "../../aimi/diagnostics/diagnostics-output.interface";
import type { PredictiveOutput } from "../../aimi/predictive/predictive-output.interface";
import type { RoutingOutput } from "../../aimi/routing/routing-output.interface";
import type { SchedulingOutput } from "../../aimi/scheduling/scheduling-output.interface";
import type { SeverityOutput } from "../../aimi/severity/severity-output.interface";

export type DriverDefectBuildResult<T> =
  | { success: true; error_code: "none"; value: T }
  | { success: false; error_code: ErrorType; value: null };

export type DriverDefect = {
  readonly tenant_id: string;
  readonly defect_id: string;
  readonly asset_id: string;
  readonly description: string;
  readonly severity: string;
  readonly status: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type DriverDefectPhoto = {
  readonly tenant_id: string;
  readonly photo_id: string;
  readonly workorder_id: string;
  readonly user_id: string;
  readonly photo_url: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type DriverDefectWriteInput = {
  readonly asset_id: string;
  readonly description: string;
  readonly severity: string;
  readonly photo_url: string;
  readonly voice: boolean;
  readonly multilingual: boolean;
};

export type DriverDefectStatusQuery = {
  readonly status: string;
};

export type DriverDefectListQuery = {
  readonly asset_id: string;
  readonly status: string;
};

export type DriverDefectListResult = {
  readonly tenant_id: string;
  readonly role: DtoRole;
  readonly defects: readonly DriverDefect[];
};

export type DriverDefectActionResult = {
  readonly tenant_id: string;
  readonly defect: DriverDefect;
  readonly photo: DriverDefectPhoto | null;
  readonly severity: SeverityOutput | null;
  readonly routing: RoutingOutput | null;
  readonly scheduling: SchedulingOutput | null;
  readonly diagnostics: DiagnosticsOutput | null;
  readonly predictive: PredictiveOutput | null;
  readonly voice: boolean;
  readonly multilingual: boolean;
};

export function freezeDriverDefect(row: DriverDefect): DriverDefect {
  return Object.freeze({
    tenant_id: row.tenant_id,
    defect_id: row.defect_id,
    asset_id: row.asset_id,
    description: row.description,
    severity: row.severity,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  });
}

export function freezeDriverDefectPhoto(row: DriverDefectPhoto): DriverDefectPhoto {
  return Object.freeze({
    tenant_id: row.tenant_id,
    photo_id: row.photo_id,
    workorder_id: row.workorder_id,
    user_id: row.user_id,
    photo_url: row.photo_url,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  });
}

export function freezeDriverDefectListResult(result: DriverDefectListResult): DriverDefectListResult {
  const defects: DriverDefect[] = [];
  let index = 0;
  while (index < result.defects.length) {
    defects.push(result.defects[index]);
    index = index + 1;
  }
  return Object.freeze({
    tenant_id: result.tenant_id,
    role: result.role,
    defects: Object.freeze(defects),
  });
}

export function freezeDriverDefectActionResult(row: DriverDefectActionResult): DriverDefectActionResult {
  return Object.freeze({
    tenant_id: row.tenant_id,
    defect: row.defect,
    photo: row.photo,
    severity: row.severity,
    routing: row.routing,
    scheduling: row.scheduling,
    diagnostics: row.diagnostics,
    predictive: row.predictive,
    voice: row.voice,
    multilingual: row.multilingual,
  });
}
