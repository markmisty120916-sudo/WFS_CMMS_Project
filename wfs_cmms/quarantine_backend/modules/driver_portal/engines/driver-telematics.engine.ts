import { matchesDriverAsset } from "../driver-portal-rules";
import type { DriverPortalFilter, DriverTelematicsItem } from "../driver-portal.interface";
import { asField } from "../driver-portal.repository";
import { driverSafeFaultLevel, driverSafeFaultWording } from "./driver-safe.engine";

export function buildDriverTelematics(
  tenant_id: string,
  telematics: readonly Readonly<Record<string, unknown>>[],
  filter: DriverPortalFilter,
): readonly DriverTelematicsItem[] {
  const items: DriverTelematicsItem[] = [];
  let index = 0;
  while (index < telematics.length) {
    const row = telematics[index];
    if (asField(row, "tenant_id") === tenant_id) {
      const asset_id = asField(row, "asset_id");
      if (matchesDriverAsset(asset_id, filter.asset) === true) {
        const level = driverSafeFaultLevel(asField(row, "severity"));
        items.push(
          Object.freeze({
            tenant_id,
            telematics_id: asField(row, "telematics_id"),
            asset_id,
            wording: driverSafeFaultWording(level),
            level,
          }),
        );
      }
    }
    index = index + 1;
  }
  return items;
}
