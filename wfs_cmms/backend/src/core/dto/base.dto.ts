export type DtoRole =
  | "admin" | "ADMIN"
  | "fleet_manager" | "FLEET_MANAGER"
  | "fleet manager" | "FLEET MANAGER"
  | "driver" | "DRIVER"
  | "parts_manager" | "PARTS_MANAGER"
  | "parts manager" | "PARTS MANAGER"
  | "compliance_officer" | "COMPLIANCE_OFFICER"
  | "compliance officer" | "COMPLIANCE OFFICER"
  | "silent_master_key" | "SILENT_MASTER_KEY"
  | "silent master key" | "SILENT MASTER KEY"
  | "asset_manager" | "ASSET_MANAGER"
  | "asset manager" | "ASSET MANAGER"
  | "technician" | "TECHNICIAN"
  | "master_technician" | "MASTER_TECHNICIAN"
  | "master technician" | "MASTER TECHNICIAN"
  | "viewer" | "VIEWER";

export interface BaseDto {
  id?: string;
  tenant_id?: string;
}
