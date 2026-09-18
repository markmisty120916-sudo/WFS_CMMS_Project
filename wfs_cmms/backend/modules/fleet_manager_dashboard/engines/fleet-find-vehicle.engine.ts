import { gpsSource, telematicsBreadcrumbSource, telematicsSource } from "../adapters/telematics.adapter";
import type { FleetFindVehiclePoint, FleetFindVehicleResult, FleetManagerFilter } from "../fleet-manager-dashboard.interface";
import { asField } from "../fleet-manager-dashboard.repository";

export const FIND_VEHICLE_LABEL = "Find Vehicle";

function laterTimestamp(left: string, right: string): boolean {
  if (right === "") {
    return false;
  }
  if (left === "") {
    return true;
  }
  return right > left;
}

export function buildFindVehicle(
  tenant_id: string,
  assets: readonly Readonly<Record<string, unknown>>[],
  telematics: readonly Readonly<Record<string, unknown>>[],
  filter: FleetManagerFilter,
): FleetFindVehicleResult {
  const latest: Record<string, string> = {};
  let scan = 0;
  while (scan < telematics.length) {
    const row = telematics[scan];
    if (asField(row, "tenant_id") === tenant_id) {
      const asset_id = asField(row, "asset_id");
      const timestamp = asField(row, "timestamp");
      if (laterTimestamp(latest[asset_id] || "", timestamp) === true) {
        latest[asset_id] = timestamp;
      }
    }
    scan = scan + 1;
  }

  const points: FleetFindVehiclePoint[] = [];
  let index = 0;
  while (index < telematics.length) {
    const row = telematics[index];
    if (asField(row, "tenant_id") === tenant_id) {
      const asset_id = asField(row, "asset_id");
      let unit_number = "";
      let vendor_id = "";
      let assetIndex = 0;
      while (assetIndex < assets.length) {
        if (asField(assets[assetIndex], "asset_id") === asset_id) {
          unit_number = asField(assets[assetIndex], "unit_number");
          vendor_id = asField(assets[assetIndex], "vendor_id");
        }
        assetIndex = assetIndex + 1;
      }
      const severity = asField(row, "severity");
      let include = true;
      if (filter.severity !== "" && severity !== filter.severity) {
        include = false;
      }
      if (filter.vendor !== "" && vendor_id !== filter.vendor) {
        include = false;
      }
      if (include === true) {
        const timestamp = asField(row, "timestamp");
        const fault_code = asField(row, "fault_code");
        let source = telematicsBreadcrumbSource();
        if (latest[asset_id] === timestamp) {
          source = gpsSource();
        } else if (fault_code !== "") {
          source = telematicsSource();
        }
        points.push(
          Object.freeze({
            tenant_id,
            asset_id,
            unit_number,
            telematics_id: asField(row, "telematics_id"),
            fault_code,
            severity,
            source,
            timestamp,
          }),
        );
      }
    }
    index = index + 1;
  }
  return Object.freeze({
    tenant_id,
    label: FIND_VEHICLE_LABEL,
    points,
  });
}
