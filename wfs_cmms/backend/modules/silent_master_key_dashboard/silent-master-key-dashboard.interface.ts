export type SilentMasterKeyFilter = {
  readonly asset: string;
  readonly workorder_id: string;
};

export type SilentMasterKeyOverrideInput = {
  readonly workorder_id: string;
  readonly asset_id: string;
  readonly severity: string;
  readonly technician_id: string;
  readonly bay_id: string;
  readonly scheduled_start: string;
  readonly scheduled_end: string;
  readonly reason: string;
};

export type SilentMasterKeyDashboardItem = {
  readonly tenant_id: string;
  readonly dashboard: string;
  readonly path: string;
};

export type SilentMasterKeyEventItem = {
  readonly tenant_id: string;
  readonly event_id: string;
  readonly event_type: string;
  readonly asset_id: string;
  readonly workorder_id: string;
  readonly reason: string;
  readonly timestamp: string;
};

export type SilentMasterKeyWorkorderItem = {
  readonly tenant_id: string;
  readonly workorder_id: string;
  readonly asset_id: string;
  readonly severity: string;
  readonly routing_tech_id: string;
  readonly routing_bay_id: string;
  readonly scheduled_start: string;
  readonly scheduled_end: string;
  readonly status: string;
};

export type SilentMasterKeyOverrideResult = {
  readonly tenant_id: string;
  readonly workorder_id: string;
  readonly event_type: string;
  readonly reason: string;
};
