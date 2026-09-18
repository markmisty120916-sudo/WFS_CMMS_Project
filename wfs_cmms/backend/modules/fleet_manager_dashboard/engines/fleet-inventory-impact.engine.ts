import type { FleetInventoryImpactItem, FleetManagerFilter } from "../fleet-manager-dashboard.interface";
import { asField } from "../fleet-manager-dashboard.repository";

export function buildInventoryImpact(
  tenant_id: string,
  parts: readonly Readonly<Record<string, unknown>>[],
  workorders: readonly Readonly<Record<string, unknown>>[],
  filter: FleetManagerFilter,
): readonly FleetInventoryImpactItem[] {
  const items: FleetInventoryImpactItem[] = [];
  let index = 0;
  while (index < parts.length) {
    const row = parts[index];
    if (asField(row, "tenant_id") === tenant_id) {
      const quantity = Number(asField(row, "quantity"));
      const vendor_id = asField(row, "vendor_id");
      let impact = "";
      if (Number.isFinite(quantity) === true && quantity <= 0) {
        impact = "critical stock";
      }
      if (filter.vendor !== "" && vendor_id !== filter.vendor) {
        impact = "";
      }
      if (impact !== "") {
        items.push(
          Object.freeze({
            tenant_id,
            part_id: asField(row, "part_id"),
            name: asField(row, "name"),
            quantity: asField(row, "quantity"),
            location: asField(row, "location"),
            vendor_id,
            impact,
            workorder_id: "",
          }),
        );
      }
    }
    index = index + 1;
  }
  let woIndex = 0;
  while (woIndex < workorders.length) {
    const row = workorders[woIndex];
    if (asField(row, "tenant_id") === tenant_id && asField(row, "status") === "waiting_parts") {
      if (filter.technician === "" || asField(row, "routing_tech_id") === filter.technician) {
        items.push(
          Object.freeze({
            tenant_id,
            part_id: "",
            name: "",
            quantity: "",
            location: "",
            vendor_id: "",
            impact: "awaiting parts",
            workorder_id: asField(row, "workorder_id"),
          }),
        );
      }
    }
    woIndex = woIndex + 1;
  }
  return items;
}
