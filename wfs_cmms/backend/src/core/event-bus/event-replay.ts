/**
 * EventBusModule — Core
 * Master Blueprint V2 / EVENT-BUS-SPEC §21 / DATABASE-SCHEMA §9.1
 * Replay preserves order, payload, tenant isolation, and RBAC.
 */

import type { Database } from "../database/database.interface";
import { createPreparedStatement } from "../database/prepared-statement";
import { normalizeEvent } from "./event-normalizer";
import type { IncomingEvent, IntegrationEvent } from "./event.interface";

export async function loadReplayEvents(
  database: Database,
  tenant_id: string,
): Promise<readonly IntegrationEvent[]> {
  if (tenant_id === "") {
    throw new Error("tenant_id required");
  }

  const statement = createPreparedStatement(
    "SELECT payload FROM IntegrationEvents WHERE tenant_id = $1 AND deleted_at IS NULL ORDER BY timestamp, event_id",
    [tenant_id],
  );
  const result = await database.execute(statement);

  const events: IntegrationEvent[] = [];
  let index = 0;
  while (index < result.rows.length) {
    const row = result.rows[index];
    index = index + 1;
    const raw = row.payload;
    if (typeof raw !== "string") {
      throw new Error("event payload invalid");
    }
    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("event payload invalid");
    }
    const incoming = parsed as IncomingEvent;
    const event = normalizeEvent(incoming);
    if (event.tenant_id !== tenant_id) {
      throw new Error("tenant_id mismatch");
    }
    events.push(event);
  }

  return events;
}

export function requireUnmodifiedReplay(
  original: IntegrationEvent,
  replayed: IntegrationEvent,
): void {
  if (original.event_id !== replayed.event_id) {
    throw new Error("replay modified");
  }
  if (original.event_type !== replayed.event_type) {
    throw new Error("replay modified");
  }
  if (original.event_category !== replayed.event_category) {
    throw new Error("replay modified");
  }
  if (original.event_source !== replayed.event_source) {
    throw new Error("replay modified");
  }
  if (original.tenant_id !== replayed.tenant_id) {
    throw new Error("replay modified");
  }
  if (original.user_id !== replayed.user_id) {
    throw new Error("replay modified");
  }
  if (original.role !== replayed.role) {
    throw new Error("replay modified");
  }
  if (original.timestamp !== replayed.timestamp) {
    throw new Error("replay modified");
  }
  if (JSON.stringify(original.event_payload) !== JSON.stringify(replayed.event_payload)) {
    throw new Error("replay modified");
  }
}
