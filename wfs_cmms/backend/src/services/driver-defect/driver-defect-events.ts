import type { IncomingEvent } from "../../core/event-bus/event.interface";
import type { ContextDto } from "../../core/dto/context.dto";
import type { DriverDefect } from "./driver-defect.interface";

export type DriverDefectAuditAction = "driver.defect.created" | "driver.defect.updated";

export function driverDefectAuditLogId(
  entity_id: string,
  action: DriverDefectAuditAction,
  timestamp: string,
): string {
  return entity_id + ":driver-defect:" + action + ":" + timestamp;
}

export function incomingEventFromDriverDefectCreated(
  dto: ContextDto,
  defect: DriverDefect,
): IncomingEvent {
  return {
    event_id: driverDefectAuditLogId(defect.defect_id, "driver.defect.created", dto.timestamp),
    event_type: "compliance.triggered",
    event_category: "compliance",
    event_source: "driver-defect-service",
    event_payload: {
      defect_id: defect.defect_id,
      asset_id: defect.asset_id,
      severity: defect.severity,
      status: defect.status,
      action: "driver.defect.created",
    },
    tenant_id: dto.tenant_id,
    user_id: dto.user_id,
    role: dto.role,
    timestamp: dto.timestamp,
  };
}

export function driverDefectEntityId(defect: DriverDefect): string {
  return defect.defect_id;
}
