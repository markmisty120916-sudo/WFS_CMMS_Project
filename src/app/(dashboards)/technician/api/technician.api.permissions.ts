import type { DtoRole } from "../../../../core/dto/base.dto";
import {
  canAccessTechnicianDashboard,
  canUseTechnicianMultilingual,
  canUseTechnicianVoice,
  canViewTechnicianAssetHealth,
  canViewTechnicianComplianceFlags,
  canViewTechnicianDiagnostics,
  canViewTechnicianInsights,
  canViewTechnicianParts,
  canViewTechnicianPm,
  canViewTechnicianSeverity,
  canViewTechnicianWorkorders,
} from "../technician.rbac";
import type { TechnicianApiOperation } from "./technician.api.contract";

export function isTechnicianApiAllowed(operation: TechnicianApiOperation, role: DtoRole): boolean {
  if (canAccessTechnicianDashboard(role) === false) {
    return false;
  }
  if (operation === "list_workorders") {
    return canViewTechnicianWorkorders(role);
  }
  if (operation === "get_workorder") {
    return canViewTechnicianWorkorders(role);
  }
  if (operation === "get_severity") {
    return canViewTechnicianSeverity(role);
  }
  if (operation === "list_insights") {
    return canViewTechnicianInsights(role);
  }
  if (operation === "list_assets") {
    return canViewTechnicianAssetHealth(role);
  }
  if (operation === "get_asset") {
    return canViewTechnicianAssetHealth(role);
  }
  if (operation === "list_pm_schedules") {
    return canViewTechnicianPm(role);
  }
  if (operation === "list_part_requests") {
    return canViewTechnicianParts(role);
  }
  if (operation === "list_events") {
    return canViewTechnicianDiagnostics(role) || canViewTechnicianComplianceFlags(role);
  }
  if (operation === "voice_command") {
    return canUseTechnicianVoice(role);
  }
  if (operation === "translate") {
    return canUseTechnicianMultilingual(role);
  }
  if (operation === "detect_language") {
    return canUseTechnicianMultilingual(role);
  }
  return false;
}
