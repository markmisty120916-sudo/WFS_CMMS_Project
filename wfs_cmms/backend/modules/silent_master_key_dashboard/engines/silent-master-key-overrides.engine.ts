import type { Database } from "../../../../src/core/database/database.interface";
import { createPreparedStatement } from "../../../../src/core/database/prepared-statement";
import type { ContextDto } from "../../../../src/core/dto/context.dto";
import { SILENT_MASTER_KEY_EVENT_TYPES } from "../silent-master-key-dashboard-events";
import type { SilentMasterKeyOverrideInput, SilentMasterKeyOverrideResult } from "../silent-master-key-dashboard.interface";
import { asField, executeTenantWrite } from "../silent-master-key-dashboard.repository";

async function loadWorkorder(
  database: Database,
  tenant_id: string,
  workorder_id: string,
): Promise<Readonly<Record<string, unknown>> | null> {
  const result = await database.execute(
    createPreparedStatement(
      "SELECT workorder_id, tenant_id, asset_id, severity, routing_tech_id, routing_bay_id, scheduled_start, scheduled_end, status, created_at, updated_at, deleted_at FROM Workorders WHERE tenant_id = $1 AND workorder_id = $2 AND deleted_at IS NULL",
      [tenant_id, workorder_id],
    ),
  );
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
}

function overrideEventId(dto: ContextDto, event_type: string): string {
  if (dto.correlation_id !== "") {
    return dto.correlation_id + ":" + event_type;
  }
  return dto.user_id + ":" + dto.timestamp + ":" + event_type;
}

export async function persistOverrideEvent(
  database: Database,
  dto: ContextDto,
  event_id: string,
  event_type: string,
  extra: Readonly<Record<string, string>>,
): Promise<void> {
  let persist_id = event_id;
  if (persist_id === "" || persist_id.indexOf(":") === 0) {
    persist_id = overrideEventId(dto, event_type);
  }
  await executeTenantWrite(
    database,
    "INSERT INTO IntegrationEvents (event_id, tenant_id, event_type, payload, timestamp, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $5, $5, NULL)",
    [
      dto.tenant_id,
      persist_id,
      event_type,
      JSON.stringify({
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        event_type,
        ...extra,
      }),
      dto.timestamp,
    ],
  );
}

export async function loadOverrideWorkorder(
  database: Database,
  tenant_id: string,
  workorder_id: string,
): Promise<Readonly<Record<string, unknown>> | null> {
  return loadWorkorder(database, tenant_id, workorder_id);
}

export async function applySeverityOverride(
  database: Database,
  dto: ContextDto,
  input: SilentMasterKeyOverrideInput,
  current: Readonly<Record<string, unknown>>,
): Promise<SilentMasterKeyOverrideResult> {
  const workorder_id = asField(current, "workorder_id");
  const asset_id = asField(current, "asset_id");
  await executeTenantWrite(
    database,
    "UPDATE Workorders SET severity = $3, updated_at = $4 WHERE tenant_id = $1 AND workorder_id = $2 AND deleted_at IS NULL",
    [dto.tenant_id, workorder_id, input.severity, dto.timestamp],
  );
  const event_id = dto.correlation_id + ":workorder.escalated";
  await persistOverrideEvent(database, dto, event_id, SILENT_MASTER_KEY_EVENT_TYPES.workorder_escalated, {
    workorder_id,
    severity: input.severity,
    asset_id,
    reason: input.reason,
  });
  return Object.freeze({
    tenant_id: dto.tenant_id,
    workorder_id,
    event_type: SILENT_MASTER_KEY_EVENT_TYPES.workorder_escalated,
    reason: input.reason,
  });
}

export async function applyRoutingOverride(
  database: Database,
  dto: ContextDto,
  input: SilentMasterKeyOverrideInput,
  current: Readonly<Record<string, unknown>>,
): Promise<SilentMasterKeyOverrideResult> {
  const workorder_id = asField(current, "workorder_id");
  await executeTenantWrite(
    database,
    "UPDATE Workorders SET routing_tech_id = $3, routing_bay_id = $4, updated_at = $5 WHERE tenant_id = $1 AND workorder_id = $2 AND deleted_at IS NULL",
    [dto.tenant_id, workorder_id, input.technician_id, input.bay_id, dto.timestamp],
  );
  const event_id = dto.correlation_id + ":routing.overridden";
  await persistOverrideEvent(database, dto, event_id, SILENT_MASTER_KEY_EVENT_TYPES.routing_overridden, {
    workorder_id,
    technician_id: input.technician_id,
    bay_id: input.bay_id,
    reason: input.reason,
  });
  return Object.freeze({
    tenant_id: dto.tenant_id,
    workorder_id,
    event_type: SILENT_MASTER_KEY_EVENT_TYPES.routing_overridden,
    reason: input.reason,
  });
}

export async function applySchedulingOverride(
  database: Database,
  dto: ContextDto,
  input: SilentMasterKeyOverrideInput,
  current: Readonly<Record<string, unknown>>,
): Promise<SilentMasterKeyOverrideResult> {
  const workorder_id = asField(current, "workorder_id");
  await executeTenantWrite(
    database,
    "UPDATE Workorders SET scheduled_start = $3, scheduled_end = $4, updated_at = $5 WHERE tenant_id = $1 AND workorder_id = $2 AND deleted_at IS NULL",
    [dto.tenant_id, workorder_id, input.scheduled_start, input.scheduled_end, dto.timestamp],
  );
  const event_id = dto.correlation_id + ":scheduling.updated";
  await persistOverrideEvent(database, dto, event_id, SILENT_MASTER_KEY_EVENT_TYPES.scheduling_updated, {
    workorder_id,
    scheduled_start: input.scheduled_start,
    scheduled_end: input.scheduled_end,
    reason: input.reason,
  });
  return Object.freeze({
    tenant_id: dto.tenant_id,
    workorder_id,
    event_type: SILENT_MASTER_KEY_EVENT_TYPES.scheduling_updated,
    reason: input.reason,
  });
}
