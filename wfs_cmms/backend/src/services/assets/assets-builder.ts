import type { ErrorType } from "../../core/errors/error-types";
import {
  freezeAsset,
  freezeAssetProfile,
  type Asset,
  type AssetBuildResult,
  type AssetHealth,
  type AssetHistory,
  type AssetPmSchedule,
  type AssetProfile,
  type AssetTelematics,
  type AssetWriteInput,
} from "./assets.interface";
import { parseCreateAssetDto } from "./dto/create-asset.dto";
import { parseUpdateAssetDto } from "./dto/update-asset.dto";
import { parseAssetStatusDto } from "./dto/asset-status.dto";
import { mapAssetRow } from "./utils/asset-mapper";

export function failAssetBuild<T>(error_code: ErrorType): AssetBuildResult<T> {
  return { success: false, error_code, value: null };
}

export function parseAssetListQuery(input: unknown) {
  return parseAssetStatusDto(input);
}

export function parseAssetWriteInput(input: unknown, mode: "create" | "update") {
  if (mode === "create") {
    return parseCreateAssetDto(input);
  }
  return parseUpdateAssetDto(input);
}

export function buildAssetFromRow(
  tenant_id: string,
  row: Readonly<Record<string, unknown>>,
): AssetBuildResult<Asset> {
  return mapAssetRow(tenant_id, row);
}

export function buildAssetForCreate(
  tenant_id: string,
  asset_id: string,
  timestamp: string,
  input: AssetWriteInput,
): AssetBuildResult<Asset> {
  if (tenant_id === "") {
    return failAssetBuild("tenant_id required");
  }
  if (asset_id === "") {
    return failAssetBuild("entity_id required");
  }
  if (timestamp === "") {
    return failAssetBuild("timestamp required");
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
): AssetBuildResult<Asset> {
  if (timestamp === "") {
    return failAssetBuild("timestamp required");
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
): AssetBuildResult<Asset> {
  if (timestamp === "") {
    return failAssetBuild("timestamp required");
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

export function buildAssetProfile(parts: {
  asset: Asset;
  health: AssetHealth | null;
  telematics: readonly AssetTelematics[];
  pm_schedules: readonly AssetPmSchedule[];
  history: AssetHistory;
  meters: AssetProfile["meters"];
  readiness: AssetProfile["readiness"];
}): AssetProfile {
  return freezeAssetProfile({
    tenant_id: parts.asset.tenant_id,
    asset: parts.asset,
    meters: parts.meters,
    health: parts.health,
    telematics: parts.telematics,
    pm_schedules: parts.pm_schedules,
    readiness: parts.readiness,
    history: parts.history,
  });
}
