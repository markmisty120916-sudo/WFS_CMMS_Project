import type { DtoRole } from "../../core/dto/base.dto";
import type { ErrorType } from "../../core/errors/error-types";
import type { PredictiveOutput } from "../../aimi/predictive/predictive-output.interface";
import type { RoutingOutput } from "../../aimi/routing/routing-output.interface";

export type PartsRequestBuildResult<T> =
  | { success: true; error_code: "none"; value: T }
  | { success: false; error_code: ErrorType; value: null };

export type PartsRequest = {
  readonly tenant_id: string;
  readonly request_id: string;
  readonly workorder_id: string;
  readonly part_id: string;
  readonly quantity: string;
  readonly status: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type PartsRequestWriteInput = {
  readonly workorder_id: string;
  readonly part_id: string;
  readonly quantity: string;
};

export type PartsRequestApproveInput = {
  readonly reason: string;
};

export type PartsRequestDenyInput = {
  readonly reason: string;
};

export type PartsRequestStatusQuery = {
  readonly status: string;
};

export type PartsRequestListQuery = {
  readonly workorder_id: string;
  readonly part_id: string;
  readonly status: string;
};

export type PartsAvailability = {
  readonly tenant_id: string;
  readonly part_id: string;
  readonly quantity_on_hand: string;
  readonly requested: string;
  readonly available: boolean;
};

export type PartsUsage = {
  readonly tenant_id: string;
  readonly part_usage_id: string;
  readonly workorder_id: string;
  readonly part_id: string;
  readonly quantity: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type WorkorderLink = {
  readonly tenant_id: string;
  readonly workorder_id: string;
  readonly asset_id: string;
  readonly source: string;
  readonly severity: string;
};

export type PartsRequestListResult = {
  readonly tenant_id: string;
  readonly role: DtoRole;
  readonly requests: readonly PartsRequest[];
};

export type PartsRequestActionResult = {
  readonly tenant_id: string;
  readonly request: PartsRequest;
  readonly availability: PartsAvailability;
  readonly usage: PartsUsage | null;
  readonly predictive: PredictiveOutput | null;
  readonly routing: RoutingOutput | null;
};

export function freezePartsRequest(row: PartsRequest): PartsRequest {
  return Object.freeze({
    tenant_id: row.tenant_id,
    request_id: row.request_id,
    workorder_id: row.workorder_id,
    part_id: row.part_id,
    quantity: row.quantity,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  });
}

export function freezePartsAvailability(row: PartsAvailability): PartsAvailability {
  return Object.freeze({
    tenant_id: row.tenant_id,
    part_id: row.part_id,
    quantity_on_hand: row.quantity_on_hand,
    requested: row.requested,
    available: row.available,
  });
}

export function freezePartsUsage(row: PartsUsage): PartsUsage {
  return Object.freeze({
    tenant_id: row.tenant_id,
    part_usage_id: row.part_usage_id,
    workorder_id: row.workorder_id,
    part_id: row.part_id,
    quantity: row.quantity,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  });
}

export function freezeWorkorderLink(row: WorkorderLink): WorkorderLink {
  return Object.freeze({
    tenant_id: row.tenant_id,
    workorder_id: row.workorder_id,
    asset_id: row.asset_id,
    source: row.source,
    severity: row.severity,
  });
}

export function freezePartsRequestListResult(result: PartsRequestListResult): PartsRequestListResult {
  const requests: PartsRequest[] = [];
  let index = 0;
  while (index < result.requests.length) {
    requests.push(result.requests[index]);
    index = index + 1;
  }
  return Object.freeze({
    tenant_id: result.tenant_id,
    role: result.role,
    requests: Object.freeze(requests),
  });
}

export function freezePartsRequestActionResult(row: PartsRequestActionResult): PartsRequestActionResult {
  return Object.freeze({
    tenant_id: row.tenant_id,
    request: row.request,
    availability: row.availability,
    usage: row.usage,
    predictive: row.predictive,
    routing: row.routing,
  });
}
