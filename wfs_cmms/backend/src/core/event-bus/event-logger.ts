/**
 * EventBusModule — Core
 * Master Blueprint V2 / EVENT-BUS-SPEC §20 / DATABASE-SCHEMA §9.2
 * Immutable event logs. tenant_id bound as $1.
 */

import type { Database } from "../database/database.interface";
import { createPreparedStatement } from "../database/prepared-statement";
import type { AuditLogHook, Logger } from "../logger/logger.interface";
import type { IntegrationEvent } from "./event.interface";

export async function logEvent(
  event: IntegrationEvent,
  logger: Logger,
  database: Database,
  auditLogHook: AuditLogHook,
): Promise<void> {
  logger.info("event-bus.log");
  auditLogHook.write({
    level: "info",
    message: "event-bus.log",
    tenant_id: event.tenant_id,
    user_id: event.user_id,
    role: event.role,
    correlation_id: event.event_id,
    timestamp: event.timestamp,
  });

  const message = JSON.stringify({
    event_id: event.event_id,
    event_type: event.event_type,
    event_payload: event.event_payload,
    tenant_id: event.tenant_id,
    user_id: event.user_id,
    role: event.role,
    timestamp: event.timestamp,
  });

  const statement = createPreparedStatement(
    "INSERT INTO IntegrationLogs (log_id, tenant_id, event_id, message, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $5, NULL)",
    [
      event.tenant_id,
      event.event_id + ":log",
      event.event_id,
      message,
      event.timestamp,
    ],
  );

  await database.execute(statement);
}
