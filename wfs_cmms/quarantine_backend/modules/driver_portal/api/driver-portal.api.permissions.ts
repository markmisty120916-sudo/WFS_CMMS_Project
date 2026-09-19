import type { DtoRole } from "../../../../src/core/dto/base.dto";
import { canAccessDriverPortal, canMutateDriverPortal } from "../driver-portal-rules";
import type { DriverPortalApiOperation } from "./driver-portal.api.contract";

export function isDriverPortalApiAllowed(operation: DriverPortalApiOperation, role: DtoRole): boolean {
  if (canAccessDriverPortal(role) === false) {
    return false;
  }
  if (operation === "assigned_vehicle") {
    return true;
  }
  if (operation === "dvir") {
    return true;
  }
  if (operation === "defect") {
    return true;
  }
  if (operation === "inspections") {
    return true;
  }
  if (operation === "workorders") {
    return true;
  }
  if (operation === "aimi_safety") {
    return true;
  }
  if (operation === "pm") {
    return true;
  }
  if (operation === "compliance") {
    return true;
  }
  if (operation === "telematics") {
    return true;
  }
  if (operation === "dvir_submit") {
    return canMutateDriverPortal(role);
  }
  if (operation === "defect_submit") {
    return canMutateDriverPortal(role);
  }
  if (operation === "note_added") {
    return canMutateDriverPortal(role);
  }
  if (operation === "photo_added") {
    return canMutateDriverPortal(role);
  }
  if (operation === "alert_acknowledged") {
    return canMutateDriverPortal(role);
  }
  return false;
}
