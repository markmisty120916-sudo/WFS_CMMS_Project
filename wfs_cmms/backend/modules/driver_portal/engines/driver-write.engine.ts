import { DRIVER_PORTAL_ACTION_TYPES, DRIVER_PORTAL_EVENT_TYPES } from "../driver-portal-events";
import type { DriverPortalWriteInput, DriverPortalWriteResult } from "../driver-portal.interface";
import { executeTenantWrite } from "../driver-portal.repository";
import type { Database } from "../../../../src/core/database/database.interface";
import type { ContextDto } from "../../../../src/core/dto/context.dto";
import { allowedDefectCategory } from "./driver-safe.engine";

function entityId(dto: ContextDto, suffix: string): string {
  if (dto.correlation_id !== "") {
    return dto.correlation_id + ":" + suffix;
  }
  return dto.user_id + ":" + dto.timestamp + ":" + suffix;
}

function eventPayload(
  dto: ContextDto,
  event_type: string,
  action_type: string,
  extra: Readonly<Record<string, string>>,
): string {
  return JSON.stringify({
    tenant_id: dto.tenant_id,
    user_id: dto.user_id,
    role: dto.role,
    action_type,
    timestamp: dto.timestamp,
    event_type,
    ...extra,
  });
}

export async function persistPortalEvent(
  database: Database,
  dto: ContextDto,
  event_id: string,
  event_type: string,
  action_type: string,
  extra: Readonly<Record<string, string>>,
): Promise<void> {
  await executeTenantWrite(
    database,
    "INSERT INTO IntegrationEvents (event_id, tenant_id, event_type, payload, timestamp, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $5, $5, NULL)",
    [dto.tenant_id, event_id, event_type, eventPayload(dto, event_type, action_type, extra), dto.timestamp],
  );
}

export async function submitDriverDefect(
  database: Database,
  dto: ContextDto,
  input: DriverPortalWriteInput,
  source: string,
): Promise<DriverPortalWriteResult> {
  const defect_id = entityId(dto, source);
  const category = allowedDefectCategory(input.category);
  let description = input.description;
  if (input.notes !== "") {
    description = description + " " + input.notes;
  }
  if (input.voice_note !== "") {
    description = description + " " + input.voice_note;
  }
  description = category + ": " + description;
  await executeTenantWrite(
    database,
    "INSERT INTO ComplianceViolations (violation_id, tenant_id, asset_id, description, severity, status, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $7, $7, NULL)",
    [dto.tenant_id, defect_id, input.asset_id, description, "", "open", dto.timestamp],
  );
  await executeTenantWrite(
    database,
    "INSERT INTO Workorders (workorder_id, tenant_id, asset_id, source, description, severity, routing_tech_id, routing_bay_id, scheduled_start, scheduled_end, status, created_by, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $13, NULL)",
    [dto.tenant_id, defect_id, input.asset_id, source, description, "", "", "", "", "", "open", dto.user_id, dto.timestamp],
  );
  if (input.photo_url !== "") {
    await executeTenantWrite(
      database,
      "INSERT INTO WorkorderPhotos (photo_id, tenant_id, workorder_id, user_id, photo_url, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $6, NULL)",
      [dto.tenant_id, defect_id + ":photo", defect_id, dto.user_id, input.photo_url, dto.timestamp],
    );
    await persistPortalEvent(database, dto, defect_id + ":photo-event", DRIVER_PORTAL_EVENT_TYPES.photo_added, DRIVER_PORTAL_ACTION_TYPES.photo_added, {
      workorder_id: defect_id,
      photo_url: input.photo_url,
    });
  }
  await persistPortalEvent(database, dto, defect_id + ":event", DRIVER_PORTAL_EVENT_TYPES.defect_submitted, DRIVER_PORTAL_ACTION_TYPES.defect_submitted, {
    defect_id,
    asset_id: input.asset_id,
    source,
  });
  return Object.freeze({
    tenant_id: dto.tenant_id,
    entity_id: defect_id,
    event_type: DRIVER_PORTAL_EVENT_TYPES.defect_submitted,
    action_type: DRIVER_PORTAL_ACTION_TYPES.defect_submitted,
  });
}

export async function submitDriverNote(
  database: Database,
  dto: ContextDto,
  input: DriverPortalWriteInput,
): Promise<DriverPortalWriteResult> {
  const note_id = entityId(dto, "note");
  await executeTenantWrite(
    database,
    "INSERT INTO WorkorderNotes (note_id, tenant_id, workorder_id, user_id, note_text, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $6, NULL)",
    [dto.tenant_id, note_id, input.workorder_id, dto.user_id, input.notes, dto.timestamp],
  );
  await persistPortalEvent(database, dto, note_id + ":event", DRIVER_PORTAL_EVENT_TYPES.note_added, DRIVER_PORTAL_ACTION_TYPES.note_added, {
    workorder_id: input.workorder_id,
  });
  return Object.freeze({
    tenant_id: dto.tenant_id,
    entity_id: note_id,
    event_type: DRIVER_PORTAL_EVENT_TYPES.note_added,
    action_type: DRIVER_PORTAL_ACTION_TYPES.note_added,
  });
}

export async function submitDriverPhoto(
  database: Database,
  dto: ContextDto,
  input: DriverPortalWriteInput,
): Promise<DriverPortalWriteResult> {
  const photo_id = entityId(dto, "photo");
  await executeTenantWrite(
    database,
    "INSERT INTO WorkorderPhotos (photo_id, tenant_id, workorder_id, user_id, photo_url, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $6, NULL)",
    [dto.tenant_id, photo_id, input.workorder_id, dto.user_id, input.photo_url, dto.timestamp],
  );
  await persistPortalEvent(database, dto, photo_id + ":event", DRIVER_PORTAL_EVENT_TYPES.photo_added, DRIVER_PORTAL_ACTION_TYPES.photo_added, {
    workorder_id: input.workorder_id,
    photo_url: input.photo_url,
  });
  return Object.freeze({
    tenant_id: dto.tenant_id,
    entity_id: photo_id,
    event_type: DRIVER_PORTAL_EVENT_TYPES.photo_added,
    action_type: DRIVER_PORTAL_ACTION_TYPES.photo_added,
  });
}

export async function acknowledgeDriverAlert(
  database: Database,
  dto: ContextDto,
  input: DriverPortalWriteInput,
): Promise<DriverPortalWriteResult> {
  const ack_id = entityId(dto, "ack");
  await persistPortalEvent(database, dto, ack_id, DRIVER_PORTAL_EVENT_TYPES.alert_acknowledged, DRIVER_PORTAL_ACTION_TYPES.alert_acknowledged, {
    alert_id: input.alert_id,
    asset_id: input.asset_id,
  });
  return Object.freeze({
    tenant_id: dto.tenant_id,
    entity_id: ack_id,
    event_type: DRIVER_PORTAL_EVENT_TYPES.alert_acknowledged,
    action_type: DRIVER_PORTAL_ACTION_TYPES.alert_acknowledged,
  });
}
