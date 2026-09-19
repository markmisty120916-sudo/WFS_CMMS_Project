import type { DtoRole } from "../../../../src/core/dto/base.dto";
import { canAccessFleetManagerDashboard } from "../fleet-manager-dashboard-rules";
import type { FleetManagerApiOperation } from "./fleet-manager-dashboard.api.contract";

export function isFleetManagerApiAllowed(operation: FleetManagerApiOperation, role: DtoRole): boolean {
  if (canAccessFleetManagerDashboard(role) === false) {
    return false;
  }
  if (operation === "fleet_health") {
    return true;
  }
  if (operation === "fleet_breakdowns") {
    return true;
  }
  if (operation === "fleet_pm_status") {
    return true;
  }
  if (operation === "fleet_inventory_impact") {
    return true;
  }
  if (operation === "fleet_technician_workload") {
    return true;
  }
  if (operation === "fleet_find_vehicle") {
    return true;
  }
  if (operation === "fleet_aimi_insights") {
    return true;
  }
  return false;
}
