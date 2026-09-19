import type { PartsManagerFilter, PartsVendorItem } from "../parts-manager-dashboard.interface";
import { asField } from "../parts-manager-dashboard.repository";

export function buildVendors(
  tenant_id: string,
  vendors: readonly Readonly<Record<string, unknown>>[],
  filter: PartsManagerFilter,
): readonly PartsVendorItem[] {
  const items: PartsVendorItem[] = [];
  let index = 0;
  while (index < vendors.length) {
    const row = vendors[index];
    if (asField(row, "tenant_id") === tenant_id) {
      const vendor_name = asField(row, "vendor_name");
      if (filter.vendor === "" || filter.vendor === vendor_name) {
        items.push(
          Object.freeze({
            tenant_id,
            vendor_name,
            location: asField(row, "location"),
            lead_time: asField(row, "lead_time"),
            preferred: asField(row, "preferred"),
          }),
        );
      }
    }
    index = index + 1;
  }
  return items;
}
