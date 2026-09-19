export function isDriver(role: string): boolean {
  return role === "driver" || role === "DRIVER";
}

export function isFleetManager(role: string): boolean {
  return role === "fleet_manager" || role === "FLEET_MANAGER" || role === "FLEET MANAGER";
}

export function isAssetManager(role: string): boolean {
  return role === "asset_manager" || role === "ASSET_MANAGER";
}

export function isPartsManager(role: string): boolean {
  return role === "parts_manager" || role === "PARTS_MANAGER" || role === "PARTS MANAGER";
}

export function isComplianceOfficer(role: string): boolean {
  return role === "compliance_officer" || role === "COMPLIANCE_OFFICER" || role === "COMPLIANCE OFFICER";
}

export function isTechnician(role: string): boolean {
  return role === "technician" || role === "TECHNICIAN";
}

export function isMasterTechnician(role: string): boolean {
  return role === "master_technician" || role === "MASTER_TECHNICIAN" || role === "MASTER TECHNICIAN";
}

export function isAdmin(role: string): boolean {
  return role === "admin" || role === "ADMIN";
}

export function isSilentMasterKey(role: string): boolean {
  return role === "silent_master_key" || role === "SILENT_MASTER_KEY" || role === "SILENT MASTER KEY";
}

export function isViewer(role: string): boolean {
  return role === "viewer" || role === "VIEWER";
}
