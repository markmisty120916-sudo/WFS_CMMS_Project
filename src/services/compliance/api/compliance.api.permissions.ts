import type { DtoRole } from "../../../core/dto/base.dto";
import { canSubmitDriverReport, canWriteCompliance } from "../compliance-rules";
import type { ComplianceApiOperation } from "./compliance.api.contract";

export function isComplianceApiAllowed(
  operation: ComplianceApiOperation,
  role: DtoRole,
): boolean {
  if (operation === "create_driver_report") {
    return canSubmitDriverReport(role);
  }
  if (operation === "list_inspections") {
    if (canWriteCompliance(role) === true) {
      return true;
    }
    if (role === "DRIVER") {
      return true;
    }
    return false;
  }
  return canWriteCompliance(role);
}
