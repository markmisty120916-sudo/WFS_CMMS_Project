import type { DriverReport, InspectionInstance, InspectionTemplate } from "../compliance.interface";

export function filterInspectionsByAsset(
  rows: readonly InspectionInstance[],
  asset_id: string,
): readonly InspectionInstance[] {
  if (asset_id === "") {
    return rows;
  }
  const filtered: InspectionInstance[] = [];
  let index = 0;
  while (index < rows.length) {
    if (rows[index].asset_id === asset_id) {
      filtered.push(rows[index]);
    }
    index = index + 1;
  }
  return filtered;
}

export function filterInspectionsByType(
  rows: readonly InspectionInstance[],
  type: string,
): readonly InspectionInstance[] {
  if (type === "") {
    return rows;
  }
  const filtered: InspectionInstance[] = [];
  let index = 0;
  while (index < rows.length) {
    if (rows[index].type === type) {
      filtered.push(rows[index]);
    }
    index = index + 1;
  }
  return filtered;
}

export function filterDotTemplates(
  rows: readonly InspectionTemplate[],
): readonly InspectionTemplate[] {
  const filtered: InspectionTemplate[] = [];
  let index = 0;
  while (index < rows.length) {
    if (rows[index].type === "DOT") {
      filtered.push(rows[index]);
    }
    index = index + 1;
  }
  return filtered;
}

export function filterOpenReports(rows: readonly DriverReport[]): readonly DriverReport[] {
  const filtered: DriverReport[] = [];
  let index = 0;
  while (index < rows.length) {
    if (rows[index].status !== "closed") {
      filtered.push(rows[index]);
    }
    index = index + 1;
  }
  return filtered;
}
