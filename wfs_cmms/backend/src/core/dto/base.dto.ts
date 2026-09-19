export type DtoRole =
  | "admin" | "ADMIN"
  | "fleet_manager" | "FLEET_MANAGER"
  | "driver" | "DRIVER"
  | "parts_manager" | "PARTS_MANAGER"
  | "parts manager" | "PARTS MANAGER"
  | "compliance_officer" | "COMPLIANCE_OFFICER"
  | "silent_master_key" | "SILENT_MASTER_KEY"
  | "asset_manager" | "ASSET_MANAGER"
  | "technician" | "TECHNICIAN"
  | "master_technician" | "MASTER_TECHNICIAN"
  | "master technician" | "MASTER TECHNICIAN"
  | "viewer" | "VIEWER";

export interface BaseDto {
  id?: string;
  tenant_id?: string;
}
