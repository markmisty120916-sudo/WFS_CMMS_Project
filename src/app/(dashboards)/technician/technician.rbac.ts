import type { DtoRole } from "../../../core/dto/base.dto";
import type { TechnicianSession, TechnicianWorkorder } from "./technician.interface";

export function canAccessTechnicianDashboard(role: DtoRole): boolean {
  if (role === "TECHNICIAN") {
    return true;
  }
  if (role === "MASTER TECHNICIAN") {
    return true;
  }
  if (role === "SILENT MASTER KEY") {
    return true;
  }
  return false;
}

export function canViewTechnicianWorkorders(role: DtoRole): boolean {
  return canAccessTechnicianDashboard(role);
}

export function canViewTechnicianDiagnostics(role: DtoRole): boolean {
  return canAccessTechnicianDashboard(role);
}

export function canViewTechnicianSeverity(role: DtoRole): boolean {
  return canAccessTechnicianDashboard(role);
}

export function canViewTechnicianPredictiveFeed(role: DtoRole): boolean {
  return canAccessTechnicianDashboard(role);
}

export function canViewTechnicianInsights(role: DtoRole): boolean {
  if (role === "MASTER TECHNICIAN") {
    return true;
  }
  if (role === "SILENT MASTER KEY") {
    return true;
  }
  return false;
}

export function canViewTechnicianAssetHealth(role: DtoRole): boolean {
  return canAccessTechnicianDashboard(role);
}

export function canViewTechnicianPm(role: DtoRole): boolean {
  return canAccessTechnicianDashboard(role);
}

export function canViewTechnicianParts(role: DtoRole): boolean {
  return canAccessTechnicianDashboard(role);
}

export function canViewTechnicianComplianceFlags(role: DtoRole): boolean {
  return canAccessTechnicianDashboard(role);
}

export function canUseTechnicianVoice(role: DtoRole): boolean {
  return canAccessTechnicianDashboard(role);
}

export function canUseTechnicianMultilingual(role: DtoRole): boolean {
  return canAccessTechnicianDashboard(role);
}

export function canUseTechnicianHud(role: DtoRole): boolean {
  return canAccessTechnicianDashboard(role);
}

export function technicianTenantAllowed(session_tenant_id: string, record_tenant_id: string): boolean {
  if (session_tenant_id === "") {
    return false;
  }
  if (record_tenant_id !== session_tenant_id) {
    return false;
  }
  return true;
}

export function isTechnicianAssignedOnly(role: DtoRole): boolean {
  if (role === "TECHNICIAN") {
    return true;
  }
  return false;
}

export function isAssignedToTechnician(session: TechnicianSession, workorder: TechnicianWorkorder): boolean {
  if (technicianTenantAllowed(session.tenant_id, workorder.tenant_id) === false) {
    return false;
  }
  if (isTechnicianAssignedOnly(session.role) === false) {
    return true;
  }
  if (workorder.routing_tech_id !== session.user_id) {
    return false;
  }
  return true;
}
