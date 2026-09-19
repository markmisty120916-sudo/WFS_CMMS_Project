import type { PartsInventoryItem, PartsInventoryOverview, PartsManagerFilter } from "../parts-manager-dashboard.interface";
import { stockStatusFromQuantity } from "../parts-manager-dashboard-rules";
import { asField } from "../parts-manager-dashboard.repository";

export function buildInventoryOverview(
  tenant_id: string,
  parts: readonly Readonly<Record<string, unknown>>[],
  filter: PartsManagerFilter,
): PartsInventoryOverview {
  const items: PartsInventoryItem[] = [];
  let critical_count = 0;
  let reorder_count = 0;
  let index = 0;
  while (index < parts.length) {
    const row = parts[index];
    if (asField(row, "tenant_id") === tenant_id) {
      const quantity = asField(row, "quantity");
      const stock_status = stockStatusFromQuantity(quantity);
      const description = asField(row, "description");
      const vendor_name = asField(row, "vendor_name") || asField(row, "location");
      let include = true;
      if (filter.part_category !== "" && description !== filter.part_category) {
        include = false;
      }
      if (filter.stock_status !== "" && stock_status !== filter.stock_status) {
        include = false;
      }
      if (filter.vendor !== "" && vendor_name !== filter.vendor) {
        include = false;
      }
      if (include === true) {
        if (stock_status === "critical") {
          critical_count = critical_count + 1;
        }
        if (stock_status === "reorder") {
          reorder_count = reorder_count + 1;
        }
        items.push(
          Object.freeze({
            tenant_id,
            part_id: asField(row, "part_id"),
            name: asField(row, "name"),
            description,
            quantity,
            location: asField(row, "location"),
            reorder_point: asField(row, "reorder_point"),
            stock_status,
            vendor_name,
          }),
        );
      }
    }
    index = index + 1;
  }
  return Object.freeze({
    tenant_id,
    part_count: String(items.length),
    critical_count: String(critical_count),
    reorder_count: String(reorder_count),
    items,
  });
}
