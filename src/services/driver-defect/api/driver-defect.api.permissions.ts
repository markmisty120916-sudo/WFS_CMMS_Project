import type { DtoRole } from "../../../core/dto/base.dto";
import {
  canCreateDriverDefect,
  canManageDriverDefect,
  canReadDriverDefect,
} from "../driver-defect-rules";
import type { DriverDefectApiOperation } from "./driver-defect.api.contract";

export function isDriverDefectApiAllowed(operation: DriverDefectApiOperation, role: DtoRole): boolean {
  if (operation === "list_defects") {
    return canReadDriverDefect(role);
  }
  if (operation === "get_defect") {
    return canReadDriverDefect(role);
  }
  if (operation === "create_defect") {
    return canCreateDriverDefect(role);
  }
  if (operation === "update_defect") {
    return canManageDriverDefect(role);
  }
  if (operation === "delete_defect") {
    return canManageDriverDefect(role);
  }
  return false;
}
