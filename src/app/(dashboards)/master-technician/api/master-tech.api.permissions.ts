import type { DtoRole } from "../../../../core/dto/base.dto";
import {
  canAccessMasterTechnicianDashboard,
  canUseMasterTechMultilingual,
  canUseMasterTechVoice,
  canViewMasterTechAimI,
  canViewMasterTechAssetHealth,
  canViewMasterTechCompliance,
  canViewMasterTechParts,
  canViewMasterTechPm,
  canViewMasterTechWorkorders,
} from "../master-tech.rbac";
import type { MasterTechApiOperation } from "./master-tech.api.contract";

export function isMasterTechApiAllowed(operation: MasterTechApiOperation, role: DtoRole): boolean {
  if (canAccessMasterTechnicianDashboard(role) === false) {
    return false;
  }
  if (operation === "list_workorders") {
    return canViewMasterTechWorkorders(role);
  }
  if (operation === "get_workorder") {
    return canViewMasterTechWorkorders(role);
  }
  if (operation === "get_severity") {
    return canViewMasterTechAimI(role);
  }
  if (operation === "launch_diagnostics") {
    return canViewMasterTechAimI(role);
  }
  if (operation === "list_insights") {
    return canViewMasterTechAimI(role);
  }
  if (operation === "list_assets") {
    return canViewMasterTechAssetHealth(role);
  }
  if (operation === "list_pm_schedules") {
    return canViewMasterTechPm(role);
  }
  if (operation === "list_parts") {
    return canViewMasterTechParts(role);
  }
  if (operation === "list_inspections") {
    return canViewMasterTechCompliance(role);
  }
  if (operation === "list_events") {
    return canViewMasterTechAimI(role);
  }
  if (operation === "voice_command") {
    return canUseMasterTechVoice(role);
  }
  if (operation === "translate") {
    return canUseMasterTechMultilingual(role);
  }
  if (operation === "detect_language") {
    return canUseMasterTechMultilingual(role);
  }
  return false;
}
