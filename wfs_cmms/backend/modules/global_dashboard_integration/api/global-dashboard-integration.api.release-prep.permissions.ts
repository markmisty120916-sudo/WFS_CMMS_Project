import type { DtoRole } from "@/dto/base.dto";
import { canAccessGlobalDashboardIntegration } from "../global-dashboard-integration-rules";
import type { GlobalDashboardIntegrationReleasePrepOperation } from "./global-dashboard-integration.api.release-prep";

export function isGlobalDashboardIntegrationReleasePrepAllowed(
  operation: GlobalDashboardIntegrationReleasePrepOperation,
  role: DtoRole,
): boolean {
  if (canAccessGlobalDashboardIntegration(role) === false) {
    return false;
  }
  if (operation === "ready") {
    return true;
  }
  if (operation === "startup") {
    return true;
  }
  return false;
}
