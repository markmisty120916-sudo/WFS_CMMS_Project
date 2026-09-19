import type { FleetBreakdownItem, FleetManagerFilter } from "../fleet-manager-dashboard.interface";
import { isOpenWorkorder, isSevereBreakdown } from "../fleet-manager-dashboard-rules";
import { asField } from "../fleet-manager-dashboard.repository";

export function buildBreakdowns(
  tenant_id: string,
  workorders: readonly Readonly<Record<string, unknown>>[],
  assets: readonly Readonly<Record<string, unknown>>[],
  filter: FleetManagerFilter,
): readonly FleetBreakdownItem[] {
  const items: FleetBreakdownItem[] = [];
  let index = 0;
  while (index < workorders.length) {
    const row = workorders[index];
    if (asField(row, "tenant_id") === tenant_id) {
      const severity = asField(row, "severity");
      const status = asField(row, "status");
      if (isSevereBreakdown(severity) === true && isOpenWorkorder(status) === true) {
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
        const technician = asField(row, "routing_tech_id");
        let include = true;
        if (filter.severity !== "" && severity !== filter.severity) {
          include = false;
        }
        if (filter.technician !== "" && technician !== filter.technician) {
          include = false;
        }
        if (filter.vendor !== "" && vendor_id !== filter.vendor) {
          include = false;
        }
        if (include === true) {
          items.push(
            Object.freeze({
              tenant_id,
              workorder_id: asField(row, "workorder_id"),
              asset_id,
              unit_number,
              severity,
              status,
              routing_tech_id: technician,
              description: asField(row, "description"),
            }),
          );
        }
      }
    }
    index = index + 1;
  }
  return items;
}
