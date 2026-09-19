import type { DtoRole } from "../../../../../src/core/dto/base.dto";
import type { GlobalDashboardIntegrationApiOperation } from "./global-dashboard-integration.api.contract";
import {
  canAccessGlobalDashboardIntegration,
  canAccessIntegrationAimi,
  canAccessIntegrationCompliance,
  canAccessIntegrationDefects,
  canAccessIntegrationInventory,
  canAccessIntegrationVendors,
} from "../global-dashboard-integration-rules";

export function isGlobalDashboardIntegrationApiAllowed(
  operation: GlobalDashboardIntegrationApiOperation,
  role: DtoRole,
): boolean {
  if (canAccessGlobalDashboardIntegration(role) === false) {
    return false;
  }
  if (operation === "assets") {
    return true;
  }
  if (operation === "workorders") {
    return true;
  }
  if (operation === "pm") {
    return true;
  }
  if (operation === "telematics") {
    return true;
  }
  if (operation === "inventory") {
    return canAccessIntegrationInventory(role);
  }
  if (operation === "vendors") {
    return canAccessIntegrationVendors(role);
  }
  if (operation === "compliance") {
    return canAccessIntegrationCompliance(role);
  }
  if (operation === "dvir") {
    return canAccessIntegrationCompliance(role);
  }
  if (operation === "defects") {
    return canAccessIntegrationDefects(role);
  }
  if (operation === "aimi") {
    return canAccessIntegrationAimi(role);
  }
  if (operation === "health") {
    return true;
  }
  return false;
}
