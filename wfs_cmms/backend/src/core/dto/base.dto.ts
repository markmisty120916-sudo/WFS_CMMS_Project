export type DtoRole =
  | "admin"
  | "fleet_manager"
  | "driver"
  | "parts_manager"
  | "compliance_officer"
  | "silent_master_key"
  | "asset_manager"
  | "technician"
  | "master_technician"
  | "viewer";

export interface BaseDto {
  id?: string;
  tenant_id?: string;
}
