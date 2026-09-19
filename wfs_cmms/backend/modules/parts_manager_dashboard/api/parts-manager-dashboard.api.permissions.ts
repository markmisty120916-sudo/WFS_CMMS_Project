import type { DtoRole } from "@/dto/base.dto";
import { canAccessPartsManagerDashboard } from "../parts-manager-dashboard-rules";
import type { PartsManagerApiOperation } from "./parts-manager-dashboard.api.contract";

export function isPartsManagerApiAllowed(operation: PartsManagerApiOperation, role: DtoRole): boolean {
  if (canAccessPartsManagerDashboard(role) === false) {
    return false;
  }
  if (operation === "inventory_overview") {
    return true;
  }
  if (operation === "awaiting_parts") {
    return true;
  }
  if (operation === "list_vendors") {
    return true;
  }
  if (operation === "usage_history") {
    return true;
  }
  if (operation === "predictive_usage") {
    return true;
  }
  if (operation === "inventory_alerts") {
    return true;
  }
  return false;
}
