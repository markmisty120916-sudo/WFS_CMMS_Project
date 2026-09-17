import type { DtoRole } from "../../../core/dto/base.dto";
import {
  canCreatePartsRequest,
  canManagePartsRequest,
  canReadPartsRequest,
} from "../parts-request-rules";
import type { PartsRequestApiOperation } from "./parts-request.api.contract";

export function isPartsRequestApiAllowed(operation: PartsRequestApiOperation, role: DtoRole): boolean {
  if (operation === "list_requests") {
    return canReadPartsRequest(role);
  }
  if (operation === "get_request") {
    return canReadPartsRequest(role);
  }
  if (operation === "create_request") {
    return canCreatePartsRequest(role);
  }
  if (operation === "update_request") {
    return canManagePartsRequest(role);
  }
  if (operation === "delete_request") {
    return canManagePartsRequest(role);
  }
  if (operation === "approve_request") {
    return canManagePartsRequest(role);
  }
  if (operation === "deny_request") {
    return canManagePartsRequest(role);
  }
  return false;
}
