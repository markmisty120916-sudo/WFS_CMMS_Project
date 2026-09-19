import type { IncomingEvent } from "../../../../src/core/event-bus/event.interface";
import type { ContextDto } from "../../../../src/core/dto/context.dto";
import type { AssetManagerImport } from "./asset-manager.interface";

export type AssetManagerAuditAction =
  | "asset.created"
  | "asset.updated"
  | "asset.deleted"
  | "bulk_import.completed"
  | "bulk_import.failed"
  | "configuration_pack.applied";

export function assetManagerAuditLogId(entity_id: string, action: AssetManagerAuditAction, timestamp: string): string {
  return entity_id + ":asset-manager:" + action + ":" + timestamp;
}

export function incomingEventFromAssetManager(
  dto: ContextDto,
  event_type: AssetManagerAuditAction,
  entity_id: string,
  payload: Readonly<Record<string, string>>,
): IncomingEvent {
  let event_category: IncomingEvent["event_category"] = "notification";
  if (event_type === "configuration_pack.applied") {
    event_category = "pm";
  }
  return {
    event_id: assetManagerAuditLogId(entity_id, event_type, dto.timestamp),
    event_type,
    event_category,
    event_source: "asset-manager",
    event_payload: payload,
    tenant_id: dto.tenant_id,
    user_id: dto.user_id,
    role: dto.role,
    timestamp: dto.timestamp,
  };
}

export function incomingEventFromImport(dto: ContextDto, record: AssetManagerImport, failed: boolean): IncomingEvent {
  const action: AssetManagerAuditAction = failed === true ? "bulk_import.failed" : "bulk_import.completed";
  return incomingEventFromAssetManager(dto, action, record.import_id, {
    import_id: record.import_id,
    data_type: record.data_type,
    status: failed === true ? "failed" : "completed",
  });
}
