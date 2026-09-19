/**
 * EventBusModule — Core
 * Master Blueprint V2 / EVENT-BUS-SPEC §22 / DATABASE-SCHEMA §9.2
 * Tenant-scoped audit of origin, routing, delivery, acknowledgment, and replay.
 */

import type { Database } from "../database/database.interface";
import { createPreparedStatement } from "../database/prepared-statement";
import type { EventAuditAction, EventRoute, IntegrationEvent } from "./event.interface";

export async function auditEvent(
  event: IntegrationEvent,
  action: EventAuditAction,
  database: Database,
  route: EventRoute | null,
): Promise<void> {
  let target = "";
  if (route !== null) {
    if (route.tenant_id !== event.tenant_id) {
      throw new Error("tenant_id mismatch");
    }
    target = route.target;
  }

  const message = JSON.stringify({
    action,
    event_id: event.event_id,
    event_type: event.event_type,
    event_source: event.event_source,
    target,
    tenant_id: event.tenant_id,
    user_id: event.user_id,
    role: event.role,
    timestamp: event.timestamp,
  });

  const statement = createPreparedStatement(
    "INSERT INTO IntegrationLogs (log_id, tenant_id, event_id, message, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $5, NULL)",
    [
      event.tenant_id,
      event.event_id + ":" + action,
      event.event_id,
      message,
      event.timestamp,
    ],
  );

  await database.execute(statement);
}
