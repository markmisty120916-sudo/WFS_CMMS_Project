import type { DtoRole } from "../../core/dto/base.dto";
import type { ErrorType } from "../../core/errors/error-types";
import type { PredictiveOutput } from "../../aimi/predictive/predictive-output.interface";

export type InventoryBuildResult<T> =
  | { success: true; error_code: "none"; value: T }
  | { success: false; error_code: ErrorType; value: null };

export type Part = {
  readonly tenant_id: string;
  readonly part_id: string;
  readonly name: string;
  readonly description: string;
  readonly quantity: string;
  readonly location: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type PartRequest = {
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

export type StockAdjustment = {
  readonly tenant_id: string;
  readonly part_id: string;
  readonly previous_quantity: string;
  readonly new_quantity: string;
  readonly delta: string;
  readonly reason: string;
};

export type Reorder = {
  readonly tenant_id: string;
  readonly request_id: string;
  readonly part_id: string;
  readonly quantity: string;
  readonly vendor_name: string;
  readonly needed: boolean;
};

export type Vendor = {
  readonly tenant_id: string;
  readonly vendor_name: string;
  readonly location: string;
};

export type PartWriteInput = {
  readonly name: string;
  readonly description: string;
  readonly quantity: string;
  readonly location: string;
};

export type StockAdjustInput = {
  readonly delta: string;
  readonly reason: string;
  readonly workorder_id: string;
};

export type ReorderInput = {
  readonly part_id: string;
  readonly quantity: string;
  readonly vendor_name: string;
  readonly reorder_point: string;
  readonly workorder_id: string;
};

export type VendorWriteInput = {
  readonly vendor_name: string;
  readonly location: string;
};

export type PartUsage = {
  readonly tenant_id: string;
  readonly part_usage_id: string;
  readonly workorder_id: string;
  readonly part_id: string;
  readonly quantity: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type StockLevel = {
  readonly tenant_id: string;
  readonly part_id: string;
  readonly quantity: string;
  readonly location: string;
  readonly reorder_point: string;
  readonly needed: boolean;
};

export type PartListQuery = {
  readonly location: string;
};

export type PartListResult = {
  readonly tenant_id: string;
  readonly role: DtoRole;
  readonly parts: readonly Part[];
};

export type StockAdjustResult = {
  readonly tenant_id: string;
  readonly part: Part;
  readonly adjustment: StockAdjustment;
  readonly predictive: PredictiveOutput | null;
};

export type ReorderResult = {
  readonly tenant_id: string;
  readonly part: Part;
  readonly reorder: Reorder;
  readonly request: PartRequest;
  readonly predictive: PredictiveOutput | null;
};

export function freezePart(row: Part): Part {
  return Object.freeze({
    tenant_id: row.tenant_id,
    part_id: row.part_id,
    name: row.name,
    description: row.description,
    quantity: row.quantity,
    location: row.location,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  });
}

export function freezePartRequest(row: PartRequest): PartRequest {
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

export function freezeStockAdjustment(row: StockAdjustment): StockAdjustment {
  return Object.freeze({
    tenant_id: row.tenant_id,
    part_id: row.part_id,
    previous_quantity: row.previous_quantity,
    new_quantity: row.new_quantity,
    delta: row.delta,
    reason: row.reason,
  });
}

export function freezeReorder(row: Reorder): Reorder {
  return Object.freeze({
    tenant_id: row.tenant_id,
    request_id: row.request_id,
    part_id: row.part_id,
    quantity: row.quantity,
    vendor_name: row.vendor_name,
    needed: row.needed,
  });
}

export function freezeVendor(row: Vendor): Vendor {
  return Object.freeze({
    tenant_id: row.tenant_id,
    vendor_name: row.vendor_name,
    location: row.location,
  });
}

export function freezePartUsage(row: PartUsage): PartUsage {
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

export function freezeStockLevel(row: StockLevel): StockLevel {
  return Object.freeze({
    tenant_id: row.tenant_id,
    part_id: row.part_id,
    quantity: row.quantity,
    location: row.location,
    reorder_point: row.reorder_point,
    needed: row.needed,
  });
}

export function freezePartListResult(result: PartListResult): PartListResult {
  const parts: Part[] = [];
  let index = 0;
  while (index < result.parts.length) {
    parts.push(result.parts[index]);
    index = index + 1;
  }
  return Object.freeze({
    tenant_id: result.tenant_id,
    role: result.role,
    parts: Object.freeze(parts),
  });
}

export function freezeStockAdjustResult(row: StockAdjustResult): StockAdjustResult {
  return Object.freeze({
    tenant_id: row.tenant_id,
    part: row.part,
    adjustment: row.adjustment,
    predictive: row.predictive,
  });
}

export function freezeReorderResult(row: ReorderResult): ReorderResult {
  return Object.freeze({
    tenant_id: row.tenant_id,
    part: row.part,
    reorder: row.reorder,
    request: row.request,
    predictive: row.predictive,
  });
}
