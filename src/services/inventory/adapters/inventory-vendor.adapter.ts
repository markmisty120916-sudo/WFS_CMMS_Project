import { freezeVendor, type Vendor, type VendorWriteInput } from "../inventory.interface";

export class InventoryVendorAdapter {
  build(tenant_id: string, input: VendorWriteInput): Vendor {
    return freezeVendor({
      tenant_id,
      vendor_name: input.vendor_name,
      location: input.location,
    });
  }
}
