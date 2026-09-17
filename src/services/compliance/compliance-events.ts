import type { ContextDto } from "../../core/dto/context.dto";
import type { IncomingEvent } from "../../core/event-bus/event.interface";
import type { DriverReport, InspectionInstance } from "./compliance.interface";

export type ComplianceAuditAction =
  | "compliance.inspection.template.created"
  | "compliance.inspection.template.updated"
  | "compliance.inspection.template.deleted"
  | "compliance.inspection.instance.created"
  | "compliance.inspection.instance.completed"
  | "compliance.driver.report.created";

export function complianceAuditLogId(
  entity_id: string,
  action: ComplianceAuditAction,
  timestamp: string,
): string {
  return entity_id + ":compliance:" + action + ":" + timestamp;
}

export function incomingEventFromInspectionCompleted(
  dto: ContextDto,
  inspection: InspectionInstance,
): IncomingEvent {
  return {
    event_id: complianceAuditLogId(
      inspection.inspection_id,
      "compliance.inspection.instance.completed",
      dto.timestamp,
    ),
    event_type: "compliance.execution.completed",
    event_category: "compliance",
    event_source: "compliance-service",
    event_payload: {
      inspection_id: inspection.inspection_id,
      asset_id: inspection.asset_id,
      type: inspection.type,
      status: inspection.status,
      action: "compliance.inspection.instance.completed",
    },
    tenant_id: dto.tenant_id,
    user_id: dto.user_id,
    role: dto.role,
    timestamp: dto.timestamp,
  };
}

export function incomingEventFromDriverReport(
  dto: ContextDto,
  report: DriverReport,
): IncomingEvent {
  return {
    event_id: complianceAuditLogId(
      report.violation_id,
      "compliance.driver.report.created",
      dto.timestamp,
    ),
    event_type: "compliance.triggered",
    event_category: "compliance",
    event_source: "compliance-service",
    event_payload: {
      violation_id: report.violation_id,
      asset_id: report.asset_id,
      severity: report.severity,
      action: "compliance.driver.report.created",
    },
    tenant_id: dto.tenant_id,
    user_id: dto.user_id,
    role: dto.role,
    timestamp: dto.timestamp,
  };
}
