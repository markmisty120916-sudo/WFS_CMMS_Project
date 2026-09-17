import type { DtoRole } from "../../../core/dto/base.dto";

export function canAccessMasterTechnicianDashboard(role: DtoRole): boolean {
  if (role === "MASTER TECHNICIAN") {
    return true;
  }
  if (role === "SILENT MASTER KEY") {
    return true;
  }
  return false;
}

export function canViewMasterTechWorkorders(role: DtoRole): boolean {
  return canAccessMasterTechnicianDashboard(role);
}

export function canViewMasterTechAimI(role: DtoRole): boolean {
  return canAccessMasterTechnicianDashboard(role);
}

export function canViewMasterTechAssetHealth(role: DtoRole): boolean {
  return canAccessMasterTechnicianDashboard(role);
}

export function canViewMasterTechPm(role: DtoRole): boolean {
  return canAccessMasterTechnicianDashboard(role);
}

export function canViewMasterTechParts(role: DtoRole): boolean {
  return canAccessMasterTechnicianDashboard(role);
}

export function canViewMasterTechCompliance(role: DtoRole): boolean {
  return canAccessMasterTechnicianDashboard(role);
}

export function canUseMasterTechVoice(role: DtoRole): boolean {
  return canAccessMasterTechnicianDashboard(role);
}

export function canUseMasterTechMultilingual(role: DtoRole): boolean {
  return canAccessMasterTechnicianDashboard(role);
}

export function canUseMasterTechHud(role: DtoRole): boolean {
  return canAccessMasterTechnicianDashboard(role);
}

export function canOpenMasterTechFleetVisualization(role: DtoRole): boolean {
  return canAccessMasterTechnicianDashboard(role);
}

export function masterTechTenantAllowed(session_tenant_id: string, record_tenant_id: string): boolean {
  if (session_tenant_id === "") {
    return false;
  }
  if (record_tenant_id !== session_tenant_id) {
    return false;
  }
  return true;
}
