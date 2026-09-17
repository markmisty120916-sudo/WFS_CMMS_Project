/**
 * Assets Service
 * Master Blueprint V2 / architecture.md §3.2 / verticals.md §2 / DATABASE-SCHEMA §3
 * Immutable asset records. AIMI health is read, not computed here.
 */

import type { DtoRole } from "../../core/dto/base.dto";

export type AssetStatus = string;

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
  readonly status: AssetStatus;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
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

export type AssetDetail = {
  readonly asset: Asset;
  readonly health: AssetHealth | null;
  readonly telematics: readonly AssetTelematics[];
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

export function freezeAssetDetail(detail: AssetDetail): AssetDetail {
  const telematics: AssetTelematics[] = [];
  let index = 0;
  while (index < detail.telematics.length) {
    telematics.push(detail.telematics[index]);
    index = index + 1;
  }
  return Object.freeze({
    asset: detail.asset,
    health: detail.health,
    telematics: Object.freeze(telematics),
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
