import type { IncomingEvent } from "../../core/event-bus/event.interface";
import type { ContextDto } from "../../core/dto/context.dto";
import type { PartsRequest } from "./parts-request.interface";

export type PartsRequestAuditAction =
  | "parts.request.created"
  | "parts.request.updated"
  | "parts.request.approved"
  | "parts.request.denied";

export function partsRequestAuditLogId(
  entity_id: string,
  action: PartsRequestAuditAction,
  timestamp: string,
): string {
  return entity_id + ":parts-request:" + action + ":" + timestamp;
}

export function incomingEventFromPartsRequestApproved(
  dto: ContextDto,
  request: PartsRequest,
): IncomingEvent {
  return {
    event_id: partsRequestAuditLogId(request.request_id, "parts.request.approved", dto.timestamp),
    event_type: "inventory.request.approved",
    event_category: "inventory",
    event_source: "parts-request-service",
    event_payload: {
      request_id: request.request_id,
      workorder_id: request.workorder_id,
      part_id: request.part_id,
      quantity: request.quantity,
      status: request.status,
      action: "parts.request.approved",
    },
    tenant_id: dto.tenant_id,
    user_id: dto.user_id,
    role: dto.role,
    timestamp: dto.timestamp,
  };
}

export function partsRequestEntityId(request: PartsRequest): string {
  return request.request_id;
}
