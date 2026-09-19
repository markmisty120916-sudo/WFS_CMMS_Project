import type { DtoRole } from "../../../../src/core/dto/base.dto";
import { canAccessComplianceDashboard, canAccessComplianceDvirOnly } from "../compliance-dashboard-rules";
import type { ComplianceDashboardApiOperation } from "./compliance-dashboard.api.contract";

export function isComplianceDashboardApiAllowed(operation: ComplianceDashboardApiOperation, role: DtoRole): boolean {
  if (canAccessComplianceDashboard(role) === false) {
    return false;
  }
  if (canAccessComplianceDvirOnly(role) === true) {
    if (operation === "dvir") {
      return true;
    }
    return false;
  }
  if (operation === "overview") {
    return true;
  }
  if (operation === "inspections") {
    return true;
  }
  if (operation === "dvir") {
    return true;
  }
  if (operation === "safety_workorders") {
    return true;
  }
  if (operation === "findings") {
    return true;
  }
  if (operation === "dot") {
    return true;
  }
  if (operation === "district") {
    return true;
  }
  if (operation === "multilingual") {
    return true;
  }
  if (operation === "voice") {
    return true;
  }
  if (operation === "aimi_insights") {
    return true;
  }
  return false;
}
