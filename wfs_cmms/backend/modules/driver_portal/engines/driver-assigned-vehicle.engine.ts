import { matchesDriverAsset } from "../driver-portal-rules";
import type { DriverAssignedVehicle, DriverPortalFilter } from "../driver-portal.interface";
import { asField } from "../driver-portal.repository";
import { driverSafeHealthScore, driverSafeOperationalStatus } from "./driver-safe.engine";

export function buildAssignedVehicle(
  tenant_id: string,
  user_id: string,
  assets: readonly Readonly<Record<string, unknown>>[],
  health: readonly Readonly<Record<string, unknown>>[],
  workorders: readonly Readonly<Record<string, unknown>>[],
  filter: DriverPortalFilter,
): DriverAssignedVehicle {
  let assigned_id = filter.asset;
  if (assigned_id === "") {
    let woIndex = 0;
    while (woIndex < workorders.length) {
      const row = workorders[woIndex];
      if (asField(row, "tenant_id") === tenant_id) {
        if (asField(row, "created_by") === user_id) {
          assigned_id = asField(row, "asset_id");
        }
      }
      woIndex = woIndex + 1;
    }
  }

  if (assigned_id !== "") {
    let index = 0;
    while (index < assets.length) {
      const row = assets[index];
      if (asField(row, "tenant_id") === tenant_id) {
        const asset_id = asField(row, "asset_id");
        if (matchesDriverAsset(asset_id, assigned_id) === true) {
          let health_score = "";
          let healthIndex = 0;
          while (healthIndex < health.length) {
            if (asField(health[healthIndex], "asset_id") === asset_id) {
              if (asField(health[healthIndex], "tenant_id") === tenant_id) {
                health_score = asField(health[healthIndex], "health_score");
              }
            }
            healthIndex = healthIndex + 1;
          }
          const status = asField(row, "status");
          return Object.freeze({
            tenant_id,
            asset_id,
            unit_number: asField(row, "unit_number"),
            make: asField(row, "make"),
            model: asField(row, "model"),
            year: asField(row, "year"),
            mileage: asField(row, "mileage"),
            hours: asField(row, "hours"),
            health_score: driverSafeHealthScore(health_score, status),
            operational_status: driverSafeOperationalStatus(status),
          });
        }
      }
      index = index + 1;
    }
  }

  return Object.freeze({
    tenant_id,
    asset_id: "",
    unit_number: "",
    make: "",
    model: "",
    year: "",
    mileage: "",
    hours: "",
    health_score: "ready",
    operational_status: "In Service",
  });
}
