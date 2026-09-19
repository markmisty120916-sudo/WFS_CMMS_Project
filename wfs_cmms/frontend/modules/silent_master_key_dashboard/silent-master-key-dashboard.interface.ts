import type { DtoRole } from "../../../../src/core/dto/base.dto";

export type SilentMasterKeySession = {
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
  readonly token: string;
};

export type SilentMasterKeyFilter = {
  readonly asset: string;
  readonly workorder_id: string;
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
