import type { DtoRole } from "../../../../src/core/dto/base.dto";
import { canAccessSilentMasterKeyDashboard, canMutateSilentMasterKeyDashboard } from "../silent-master-key-dashboard-rules";
import type { SilentMasterKeyApiOperation } from "./silent-master-key-dashboard.api.contract";

export function isSilentMasterKeyApiAllowed(operation: SilentMasterKeyApiOperation, role: DtoRole): boolean {
  if (canAccessSilentMasterKeyDashboard(role) === false) {
    return false;
  }
  if (operation === "dashboards") {
    return true;
  }
  if (operation === "aimi") {
    return true;
  }
  if (operation === "predictive") {
    return true;
  }
  if (operation === "diagnostics") {
    return true;
  }
  if (operation === "workorders") {
    return true;
  }
  if (operation === "severity_override") {
    return canMutateSilentMasterKeyDashboard(role);
  }
  if (operation === "routing_override") {
    return canMutateSilentMasterKeyDashboard(role);
  }
  if (operation === "scheduling_override") {
    return canMutateSilentMasterKeyDashboard(role);
  }
  return false;
}
