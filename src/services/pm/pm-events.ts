import type { IncomingEvent } from "../../core/event-bus/event.interface";
import type { ContextDto } from "../../core/dto/context.dto";
import type { PmSchedule, PmTemplate } from "./pm.interface";

export type PmAuditAction =
  | "pm.template.created"
  | "pm.template.updated"
  | "pm.template.deleted"
  | "pm.instance.created"
  | "pm.instance.completed";

export function pmAuditLogId(
  entity_id: string,
  action: PmAuditAction,
  timestamp: string,
): string {
  return entity_id + ":pm:" + action + ":" + timestamp;
}

export function incomingEventFromPmCompleted(
  dto: ContextDto,
  schedule: PmSchedule,
): IncomingEvent {
  return {
    event_id: pmAuditLogId(schedule.pm_schedule_id, "pm.instance.completed", dto.timestamp),
    event_type: "pm.completed",
    event_category: "pm",
    event_source: "pm-service",
    event_payload: {
      pm_schedule_id: schedule.pm_schedule_id,
      asset_id: schedule.asset_id,
      pm_template_id: schedule.pm_template_id,
      action: "pm.instance.completed",
    },
    tenant_id: dto.tenant_id,
    user_id: dto.user_id,
    role: dto.role,
    timestamp: dto.timestamp,
  };
}

export function pmTemplateEntityId(template: PmTemplate): string {
  return template.pm_template_id;
}

export function pmScheduleEntityId(schedule: PmSchedule): string {
  return schedule.pm_schedule_id;
}
