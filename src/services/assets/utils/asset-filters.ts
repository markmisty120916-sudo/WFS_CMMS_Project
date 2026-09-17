import type { Asset, AssetListQuery } from "../assets.interface";

export function filterAssetsByStatus(
  assets: readonly Asset[],
  status: string,
): readonly Asset[] {
  if (status === "") {
    return assets;
  }
  const filtered: Asset[] = [];
  let index = 0;
  while (index < assets.length) {
    const asset = assets[index];
    if (asset.status === status) {
      filtered.push(asset);
    }
    index = index + 1;
  }
  return filtered;
}

export function filterAssignedAssets(
  assets: readonly Asset[],
  entity_id: string,
): readonly Asset[] {
  const filtered: Asset[] = [];
  let index = 0;
  while (index < assets.length) {
    const asset = assets[index];
    if (asset.asset_id === entity_id) {
      filtered.push(asset);
    }
    index = index + 1;
  }
  return filtered;
}

export function listQueryHasUnsupportedGroup(query: AssetListQuery): boolean {
  if (query.group_id !== "") {
    return true;
  }
  return false;
}
