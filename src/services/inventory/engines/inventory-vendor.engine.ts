import { InventoryVendorAdapter } from "../adapters/inventory-vendor.adapter";
import type { Vendor, VendorWriteInput } from "../inventory.interface";

export class InventoryVendorEngine {
  private readonly adapter: InventoryVendorAdapter;
  private readonly vendors: Vendor[];

  constructor(adapter: InventoryVendorAdapter) {
    this.adapter = adapter;
    this.vendors = [];
  }

  apply(tenant_id: string, input: VendorWriteInput): Vendor {
    const vendor = this.adapter.build(tenant_id, input);
    let index = 0;
    let replaced = false;
    while (index < this.vendors.length) {
      if (this.vendors[index].vendor_name === vendor.vendor_name) {
        this.vendors[index] = vendor;
        replaced = true;
      }
      index = index + 1;
    }
    if (replaced === false) {
      this.vendors.push(vendor);
    }
    return vendor;
  }

  load(vendor_name: string): Vendor | null {
    let index = 0;
    while (index < this.vendors.length) {
      if (this.vendors[index].vendor_name === vendor_name) {
        return this.vendors[index];
      }
      index = index + 1;
    }
    return null;
  }

  loadList(): readonly Vendor[] {
    const rows: Vendor[] = [];
    let index = 0;
    while (index < this.vendors.length) {
      rows.push(this.vendors[index]);
      index = index + 1;
    }
    return rows;
  }
}
