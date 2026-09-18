import type { DtoRole } from "../../../../src/core/dto/base.dto";

export type PartsManagerSession = {
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
  readonly token: string;
};

export type PartsManagerFilter = {
  readonly vendor: string;
  readonly part_category: string;
  readonly stock_status: string;
  readonly severity: string;
};

export type PartsInventoryItem = {
  readonly tenant_id: string;
  readonly part_id: string;
  readonly name: string;
  readonly description: string;
  readonly quantity: string;
  readonly location: string;
  readonly reorder_point: string;
  readonly stock_status: string;
  readonly vendor_name: string;
};

export type PartsInventoryOverview = {
  readonly tenant_id: string;
  readonly part_count: string;
  readonly critical_count: string;
  readonly reorder_count: string;
  readonly items: readonly PartsInventoryItem[];
};

export type PartsAwaitingItem = {
  readonly tenant_id: string;
  readonly workorder_id: string;
  readonly part_id: string;
  readonly quantity: string;
  readonly status: string;
  readonly severity: string;
};

export type PartsVendorItem = {
  readonly tenant_id: string;
  readonly vendor_name: string;
  readonly location: string;
  readonly lead_time: string;
  readonly preferred: string;
};

export type PartsUsageItem = {
  readonly tenant_id: string;
  readonly part_usage_id: string;
  readonly part_id: string;
  readonly workorder_id: string;
  readonly quantity: string;
  readonly usage_type: string;
  readonly created_at: string;
};

export type PartsPredictiveItem = {
  readonly tenant_id: string;
  readonly event_id: string;
  readonly event_type: string;
  readonly part_id: string;
  readonly workorder_id: string;
  readonly reason: string;
  readonly timestamp: string;
};

export type PartsAlertItem = {
  readonly tenant_id: string;
  readonly alert_type: string;
  readonly part_id: string;
  readonly workorder_id: string;
  readonly vendor_name: string;
  readonly message: string;
};
