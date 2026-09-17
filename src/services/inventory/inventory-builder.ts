import type { ErrorType } from "../../core/errors/error-types";
import { parseAdjustStockDto } from "./dto/adjust-stock.dto";
import { parseCreatePartDto } from "./dto/create-part.dto";
import { parseReorderPartDto } from "./dto/reorder-part.dto";
import { parseUpdatePartDto } from "./dto/update-part.dto";
import { parseVendorDto } from "./dto/vendor.dto";
import {
  freezePart,
  type InventoryBuildResult,
  type Part,
  type PartWriteInput,
} from "./inventory.interface";
import { asRecord, asString } from "../../core/validation/dto.schema";

export function failInventoryBuild<T>(error_code: ErrorType): InventoryBuildResult<T> {
  return { success: false, error_code, value: null };
}

export function parsePartCreate(input: unknown) {
  return parseCreatePartDto(input);
}

export function parsePartUpdate(input: unknown) {
  return parseUpdatePartDto(input);
}

export function parseStockAdjust(input: unknown) {
  return parseAdjustStockDto(input);
}

export function parsePartReorder(input: unknown) {
  return parseReorderPartDto(input);
}

export function parseVendorWrite(input: unknown) {
  return parseVendorDto(input);
}

export function parsePartListQuery(input: unknown): { location: string } {
  if (input === undefined) {
    return { location: "" };
  }
  const record = asRecord(input);
  if (record === null) {
    return { location: "" };
  }
  return { location: asString(record.location) };
}

export function parseStockLevelQuery(input: unknown): { reorder_point: string } {
  if (input === undefined) {
    return { reorder_point: "" };
  }
  const record = asRecord(input);
  if (record === null) {
    return { reorder_point: "" };
  }
  return { reorder_point: asString(record.reorder_point) };
}

export function applyPartWrite(
  tenant_id: string,
  part_id: string,
  timestamp: string,
  input: PartWriteInput,
  current: Part | null,
): InventoryBuildResult<Part> {
  if (tenant_id === "") {
    return failInventoryBuild("tenant_id required");
  }
  if (part_id === "") {
    return failInventoryBuild("entity_id required");
  }
  if (timestamp === "") {
    return failInventoryBuild("timestamp required");
  }
  let created_at = timestamp;
  if (current !== null) {
    created_at = current.created_at;
  }
  return {
    success: true,
    error_code: "none",
    value: freezePart({
      tenant_id,
      part_id,
      name: input.name,
      description: input.description,
      quantity: input.quantity,
      location: input.location,
      created_at,
      updated_at: timestamp,
      deleted_at: null,
    }),
  };
}

export function buildPartForSoftDelete(current: Part, timestamp: string): InventoryBuildResult<Part> {
  if (timestamp === "") {
    return failInventoryBuild("timestamp required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezePart({
      tenant_id: current.tenant_id,
      part_id: current.part_id,
      name: current.name,
      description: current.description,
      quantity: current.quantity,
      location: current.location,
      created_at: current.created_at,
      updated_at: timestamp,
      deleted_at: timestamp,
    }),
  };
}
