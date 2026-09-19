import type { DtoRole } from "../../../core/dto/base.dto";
import { canReadAllPm, canReadLinkedPm, canWritePm } from "../pm-rules";
import type { PmApiOperation } from "./pm.api.contract";

export function isPmApiAllowed(operation: PmApiOperation, role: DtoRole): boolean {
  if (operation === "list_templates") {
    return canReadAllPm(role);
  }
  if (operation === "create_template") {
    return canWritePm(role);
  }
  if (operation === "update_template") {
    return canWritePm(role);
  }
  if (operation === "delete_template") {
    return canWritePm(role);
  }
  if (operation === "list_schedules") {
    if (canReadAllPm(role) === true) {
      return true;
    }
    if (canReadLinkedPm(role) === true) {
      return true;
    }
    return false;
  }
  if (operation === "create_instance") {
    return canWritePm(role);
  }
  if (operation === "complete") {
    return canWritePm(role);
  }
  return false;
}
