import type { FleetHealthItem, FleetHealthOverview, FleetManagerFilter } from "../fleet-manager-dashboard.interface";
import { asField } from "../fleet-manager-dashboard.repository";

function matchesFilter(item: FleetHealthItem, filter: FleetManagerFilter): boolean {
  if (filter.severity !== "" && item.severity !== filter.severity) {
    return false;
  }
  if (filter.asset_group !== "" && item.asset_group !== filter.asset_group) {
    return false;
  }
  if (filter.vendor !== "" && item.vendor_id !== filter.vendor) {
    return false;
  }
  return true;
}

export function buildFleetHealth(
  tenant_id: string,
  assets: readonly Readonly<Record<string, unknown>>[],
  health: readonly Readonly<Record<string, unknown>>[],
  workorders: readonly Readonly<Record<string, unknown>>[],
  schedules: readonly Readonly<Record<string, unknown>>[],
  filter: FleetManagerFilter,
): FleetHealthOverview {
  const items: FleetHealthItem[] = [];
  let s1 = 0;
  let s2 = 0;
  let s3 = 0;
  let s4 = 0;
  let s5 = 0;
  let index = 0;
  while (index < assets.length) {
    const asset = assets[index];
    if (asField(asset, "tenant_id") === tenant_id) {
      const asset_id = asField(asset, "asset_id");
      let health_score = "";
      let predictive_score = "";
      let last_update = "";
      let healthIndex = 0;
      while (healthIndex < health.length) {
        if (asField(health[healthIndex], "asset_id") === asset_id && asField(health[healthIndex], "tenant_id") === tenant_id) {
          health_score = asField(health[healthIndex], "health_score");
          predictive_score = asField(health[healthIndex], "predictive_score");
          last_update = asField(health[healthIndex], "last_update");
        }
        healthIndex = healthIndex + 1;
      }
      let severity = "";
      let woIndex = 0;
      while (woIndex < workorders.length) {
        if (asField(workorders[woIndex], "asset_id") === asset_id && asField(workorders[woIndex], "tenant_id") === tenant_id) {
          const candidate = asField(workorders[woIndex], "severity");
          if (severity === "" || candidate < severity) {
            severity = candidate;
          }
        }
        woIndex = woIndex + 1;
      }
      let asset_group = "";
      let pmIndex = 0;
      while (pmIndex < schedules.length) {
        if (asField(schedules[pmIndex], "asset_id") === asset_id && asField(schedules[pmIndex], "tenant_id") === tenant_id) {
          asset_group = asField(schedules[pmIndex], "asset_group");
        }
        pmIndex = pmIndex + 1;
      }
      const item: FleetHealthItem = Object.freeze({
        tenant_id,
        asset_id,
        unit_number: asField(asset, "unit_number"),
        status: asField(asset, "status"),
        health_score,
        predictive_score,
        severity,
        asset_group,
        vendor_id: asField(asset, "vendor_id"),
        last_update,
      });
      if (matchesFilter(item, filter) === true) {
        items.push(item);
        if (item.severity === "S1") {
          s1 = s1 + 1;
        }
        if (item.severity === "S2") {
          s2 = s2 + 1;
        }
        if (item.severity === "S3") {
          s3 = s3 + 1;
        }
        if (item.severity === "S4") {
          s4 = s4 + 1;
        }
        if (item.severity === "S5") {
          s5 = s5 + 1;
        }
      }
    }
    index = index + 1;
  }
  return Object.freeze({
    tenant_id,
    asset_count: String(items.length),
    s1: String(s1),
    s2: String(s2),
    s3: String(s3),
    s4: String(s4),
    s5: String(s5),
    items,
  });
}
