import type { DriverDefect } from "../driver-defect.interface";

export function filterDefectsByAsset(
  defects: readonly DriverDefect[],
  asset_id: string,
): readonly DriverDefect[] {
  if (asset_id === "") {
    return defects;
  }
  const filtered: DriverDefect[] = [];
  let index = 0;
  while (index < defects.length) {
    if (defects[index].asset_id === asset_id) {
      filtered.push(defects[index]);
    }
    index = index + 1;
  }
  return filtered;
}

export function filterDefectsByStatus(
  defects: readonly DriverDefect[],
  status: string,
): readonly DriverDefect[] {
  if (status === "") {
    return defects;
  }
  const filtered: DriverDefect[] = [];
  let index = 0;
  while (index < defects.length) {
    if (defects[index].status === status) {
      filtered.push(defects[index]);
    }
    index = index + 1;
  }
  return filtered;
}
