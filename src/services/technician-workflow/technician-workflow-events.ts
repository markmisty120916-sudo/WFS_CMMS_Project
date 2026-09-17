import type { IncomingEvent } from "../../core/event-bus/event.interface";
import type { ContextDto } from "../../core/dto/context.dto";
import type { WorkflowInstance } from "./technician-workflow.interface";

export type TechnicianWorkflowAuditAction =
  | "workflow.started"
  | "workflow.step.updated"
  | "workflow.completed";

export function technicianWorkflowAuditLogId(
  entity_id: string,
  action: TechnicianWorkflowAuditAction,
  timestamp: string,
): string {
  return entity_id + ":technician-workflow:" + action + ":" + timestamp;
}

export function incomingEventFromWorkflowCompleted(
  dto: ContextDto,
  workflow: WorkflowInstance,
): IncomingEvent {
  return {
    event_id: technicianWorkflowAuditLogId(workflow.workorder_id, "workflow.completed", dto.timestamp),
    event_type: "workorder.completed",
    event_category: "workorder.lifecycle",
    event_source: "technician-workflow-service",
    event_payload: {
      workorder_id: workflow.workorder_id,
      asset_id: workflow.asset_id,
      status: workflow.status,
      action: "workflow.completed",
    },
    tenant_id: dto.tenant_id,
    user_id: dto.user_id,
    role: dto.role,
    timestamp: dto.timestamp,
  };
}

export function technicianWorkflowEntityId(workflow: WorkflowInstance): string {
  return workflow.workorder_id;
}
