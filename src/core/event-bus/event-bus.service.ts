/**
 * EventBusModule — Core
 * Master Blueprint V2 / EVENT-BUS-SPEC §3 / BACKEND-STRUCTURE §4
 * Producer pipeline: normalize → persist → route → log → deliver → audit.
 * Zero global state. No payload mutation. No silent drop.
 */

import type { Database } from "../database/database.interface";
import { createPreparedStatement } from "../database/prepared-statement";
import type { AuditLogHook, Logger } from "../logger/logger.interface";
import { auditEvent } from "./event-audit";
import { deliverEvent } from "./event-delivery";
import { logEvent } from "./event-logger";
import { normalizeEvent } from "./event-normalizer";
import { loadReplayEvents } from "./event-replay";
import { routeEvent } from "./event-router";
import type {
  EventBusRbacHook,
  EventSubscriber,
  IncomingEvent,
  IntegrationEvent,
} from "./event.interface";

export type EventBusServiceOptions = {
  tenant_id: string;
  logger: Logger;
  database: Database;
  auditLogHook: AuditLogHook;
  rbacHook: EventBusRbacHook;
  subscribers: readonly EventSubscriber[];
};

export class EventBusService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;
  private readonly auditLogHook: AuditLogHook;
  private readonly rbacHook: EventBusRbacHook;
  private readonly subscribers: readonly EventSubscriber[];

  constructor(options: EventBusServiceOptions) {
    if (options.tenant_id === "") {
      throw new Error("tenant_id required");
    }
    this.tenant_id = options.tenant_id;
    this.logger = options.logger;
    this.database = options.database;
    this.auditLogHook = options.auditLogHook;
    this.rbacHook = options.rbacHook;
    this.subscribers = options.subscribers;
  }

  async publish(incoming: IncomingEvent): Promise<IntegrationEvent> {
    const event = normalizeEvent(incoming);
    if (event.tenant_id !== this.tenant_id) {
      throw new Error("tenant_id mismatch");
    }
    this.rbacHook.assert(event);

    const persist = createPreparedStatement(
      "INSERT INTO IntegrationEvents (event_id, tenant_id, event_type, payload, timestamp, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $5, $5, NULL)",
      [
        event.tenant_id,
        event.event_id,
        event.event_type,
        JSON.stringify(event),
        event.timestamp,
      ],
    );
    await this.database.execute(persist);
    await auditEvent(event, "origin", this.database, null);

    const route = routeEvent(event);
    if (route.tenant_id !== this.tenant_id) {
      throw new Error("tenant_id mismatch");
    }
    await auditEvent(event, "routing", this.database, route);
    await logEvent(event, this.logger, this.database, this.auditLogHook);
    await deliverEvent(event, route, this.subscribers);
    await auditEvent(event, "delivery", this.database, route);
    await auditEvent(event, "acknowledgment", this.database, route);

    return event;
  }

  async replay(): Promise<void> {
    const events = await loadReplayEvents(this.database, this.tenant_id);
    let index = 0;
    while (index < events.length) {
      const event = events[index];
      index = index + 1;
      if (event.tenant_id !== this.tenant_id) {
        throw new Error("tenant_id mismatch");
      }
      this.rbacHook.assert(event);
      const route = routeEvent(event);
      await deliverEvent(event, route, this.subscribers);
      await auditEvent(event, "replay", this.database, route);
    }
  }
}
