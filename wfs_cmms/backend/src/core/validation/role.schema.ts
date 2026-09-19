import type { DtoRole } from "../dto/base.dto";

export function parseDtoRole(value: unknown): DtoRole | null {
  if (typeof value !== "string") {
    return null;
  }
  if (value === "admin" || value === "ADMIN") {
    return value;
  }
  if (value === "fleet_manager" || value === "FLEET_MANAGER" || value === "fleet manager" || value === "FLEET MANAGER") {
    return value;
  }
  if (value === "driver" || value === "DRIVER") {
    return value;
  }
  if (value === "parts_manager" || value === "PARTS_MANAGER" || value === "parts manager" || value === "PARTS MANAGER") {
    return value;
  }
  if (value === "compliance_officer" || value === "COMPLIANCE_OFFICER" || value === "compliance officer" || value === "COMPLIANCE OFFICER") {
    return value;
  }
  if (value === "silent_master_key" || value === "SILENT_MASTER_KEY" || value === "silent master key" || value === "SILENT MASTER KEY") {
    return value;
  }
  if (value === "asset_manager" || value === "ASSET_MANAGER" || value === "asset manager" || value === "ASSET MANAGER") {
    return value;
  }
  if (value === "technician" || value === "TECHNICIAN") {
    return value;
  }
  if (value === "master_technician" || value === "MASTER_TECHNICIAN" || value === "master technician" || value === "MASTER TECHNICIAN") {
    return value;
  }
  if (value === "viewer" || value === "VIEWER") {
    return value;
  }
  return null;
}
