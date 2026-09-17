/**
 * Assets Service
 * Master Blueprint V2 / DATABASE-SCHEMA §3 / API-SPEC §3
 * Builds immutable Assets, AssetHealth, and AssetTelematics records.
 */

import type { ErrorType } from "../../core/errors/error-types";
import { asRecord, asString } from "../../core/validation/dto.schema";
import { assetTenantError } from "./assets-rules";
import {
  freezeAsset,
  freezeAssetHealth,
  freezeAssetTelematics,
  type Asset,
  type AssetHealth,
  type AssetListQuery,
  type AssetTelematics,
  type AssetWriteInput,
} from "./assets.interface";

export type AssetsBuildResult<T> =
  | { success: true; error_code: "none"; value: T }
  | { success: false; error_code: ErrorType; value: null };

function fail<T>(error_code: ErrorType): AssetsBuildResult<T> {
  return { success: false, error_code, value: null };
}

function asFieldString(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return String(value);
  }
  return "";
}

function asDeletedAt(value: unknown): string | null {
  if (value === null) {
    return null;
  }
  if (value === undefined) {
    return null;
  }
  const text = asFieldString(value);
  if (text === "") {
    return null;
  }
  return text;
}

export function parseAssetListQuery(input: unknown): AssetsBuildResult<AssetListQuery> {
  if (input === undefined) {
    return {
      success: true,
      error_code: "none",
      value: Object.freeze({
        status: "",
        group_id: "",
      }),
    };
  }
  const record = asRecord(input);
  if (record === null) {
    return fail("dto invalid");
  }
  const status = asString(record.status);
  const group_id = asString(record.group_id);
  if (group_id !== "") {
    return fail("dto invalid");
  }
  return {
    success: true,
    error_code: "none",
    value: Object.freeze({
      status,
      group_id,
    }),
  };
}

export function parseAssetWriteInput(input: unknown): AssetsBuildResult<AssetWriteInput> {
  const record = asRecord(input);
  if (record === null) {
    return fail("dto invalid");
  }
  const asset_number = asString(record.asset_number);
  const vin = asString(record.vin);
  const make = asString(record.make);
  const model = asString(record.model);
  const year = asFieldString(record.year);
  const type = asString(record.type);
  const location = asString(record.location);
  if (asset_number === "") {
    return fail("dto invalid");
  }
  if (vin === "") {
    return fail("dto invalid");
  }
  if (make === "") {
    return fail("dto invalid");
  }
  if (model === "") {
    return fail("dto invalid");
  }
  if (year === "") {
    return fail("dto invalid");
  }
  if (type === "") {
    return fail("dto invalid");
  }
  if (location === "") {
    return fail("dto invalid");
  }
  return {
    success: true,
    error_code: "none",
    value: Object.freeze({
      asset_number,
      vin,
      make,
      model,
      year,
      type,
      location,
    }),
  };
}

export function buildAssetFromRow(
  tenant_id: string,
  row: Readonly<Record<string, unknown>>,
): AssetsBuildResult<Asset> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = assetTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const asset_id = asFieldString(row.asset_id);
  if (asset_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeAsset({
      tenant_id: record_tenant_id,
      asset_id,
      vin: asFieldString(row.vin),
      unit_number: asFieldString(row.unit_number),
      make: asFieldString(row.make),
      model: asFieldString(row.model),
      year: asFieldString(row.year),
      mileage: asFieldString(row.mileage),
      hours: asFieldString(row.hours),
      status: asFieldString(row.status),
      created_at: asFieldString(row.created_at),
      updated_at: asFieldString(row.updated_at),
      deleted_at: asDeletedAt(row.deleted_at),
    }),
  };
}

export function buildAssetHealthFromRow(
  tenant_id: string,
  asset_id: string,
  row: Readonly<Record<string, unknown>>,
): AssetsBuildResult<AssetHealth> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = assetTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const record_asset_id = asFieldString(row.asset_id);
  if (record_asset_id !== asset_id) {
    return fail("entity_id mismatch");
  }
  const health_id = asFieldString(row.health_id);
  if (health_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeAssetHealth({
      tenant_id: record_tenant_id,
      health_id,
      asset_id: record_asset_id,
      health_score: asFieldString(row.health_score),
      predictive_score: asFieldString(row.predictive_score),
      last_update: asFieldString(row.last_update),
      created_at: asFieldString(row.created_at),
      updated_at: asFieldString(row.updated_at),
      deleted_at: asDeletedAt(row.deleted_at),
    }),
  };
}

export function buildAssetTelematicsFromRow(
  tenant_id: string,
  asset_id: string,
  row: Readonly<Record<string, unknown>>,
): AssetsBuildResult<AssetTelematics> {
  const record_tenant_id = asFieldString(row.tenant_id);
  const tenant_error = assetTenantError(tenant_id, record_tenant_id);
  if (tenant_error !== "none") {
    return fail(tenant_error);
  }
  const record_asset_id = asFieldString(row.asset_id);
  if (record_asset_id !== asset_id) {
    return fail("entity_id mismatch");
  }
  const telematics_id = asFieldString(row.telematics_id);
  if (telematics_id === "") {
    return fail("entity_id required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeAssetTelematics({
      tenant_id: record_tenant_id,
      telematics_id,
      asset_id: record_asset_id,
      fault_code: asFieldString(row.fault_code),
      fault_description: asFieldString(row.fault_description),
      severity: asFieldString(row.severity),
      timestamp: asFieldString(row.timestamp),
      created_at: asFieldString(row.created_at),
      updated_at: asFieldString(row.updated_at),
      deleted_at: asDeletedAt(row.deleted_at),
    }),
  };
}

export function buildAssetForCreate(
  tenant_id: string,
  asset_id: string,
  timestamp: string,
  input: AssetWriteInput,
): AssetsBuildResult<Asset> {
  if (tenant_id === "") {
    return fail("tenant_id required");
  }
  if (asset_id === "") {
    return fail("entity_id required");
  }
  if (timestamp === "") {
    return fail("timestamp required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeAsset({
      tenant_id,
      asset_id,
      vin: input.vin,
      unit_number: input.asset_number,
      make: input.make,
      model: input.model,
      year: input.year,
      mileage: "",
      hours: "",
      status: "",
      created_at: timestamp,
      updated_at: timestamp,
      deleted_at: null,
    }),
  };
}

export function buildAssetForUpdate(
  current: Asset,
  timestamp: string,
  input: AssetWriteInput,
): AssetsBuildResult<Asset> {
  if (timestamp === "") {
    return fail("timestamp required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeAsset({
      tenant_id: current.tenant_id,
      asset_id: current.asset_id,
      vin: input.vin,
      unit_number: input.asset_number,
      make: input.make,
      model: input.model,
      year: input.year,
      mileage: current.mileage,
      hours: current.hours,
      status: current.status,
      created_at: current.created_at,
      updated_at: timestamp,
      deleted_at: current.deleted_at,
    }),
  };
}

export function buildAssetForSoftDelete(
  current: Asset,
  timestamp: string,
): AssetsBuildResult<Asset> {
  if (timestamp === "") {
    return fail("timestamp required");
  }
  return {
    success: true,
    error_code: "none",
    value: freezeAsset({
      tenant_id: current.tenant_id,
      asset_id: current.asset_id,
      vin: current.vin,
      unit_number: current.unit_number,
      make: current.make,
      model: current.model,
      year: current.year,
      mileage: current.mileage,
      hours: current.hours,
      status: current.status,
      created_at: current.created_at,
      updated_at: timestamp,
      deleted_at: timestamp,
    }),
  };
}
