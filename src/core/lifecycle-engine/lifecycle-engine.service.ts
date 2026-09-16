/**
 * LifecycleEngine — Core
 * Master Blueprint V2 / cursor-instructions §10 / WORKORDER-LIFECYCLE
 * Deterministic state machine. Emits through EventBus. No global instance.
 */

import type { Database } from "../database/database.interface";
import { createPreparedStatement } from "../database/prepared-statement";
import type { EventBusService } from "../event-bus/event-bus.service";
import type { AuditLogHook, Logger } from "../logger/logger.interface";
import type { LifecycleContext } from "./lifecycle-context";
import { incomingEventFromSnapshot } from "./lifecycle-events";
import {
  assertInvariants,
  assertPostconditions,
  assertPreconditions,
  initialStateForKind,
  isRoleAllowedForKind,
} from "./lifecycle-guards";
import { createLifecycleSnapshot, type LifecycleSnapshot } from "./lifecycle-snapshot";
import type { LifecycleState } from "./lifecycle-state.interface";

export type LifecycleEngineServiceOptions = {
  tenant_id: string;
  logger: Logger;
  database: Database;
  eventBus: EventBusService;
  auditLogHook: AuditLogHook;
};

export class LifecycleEngineService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;
  private readonly eventBus: EventBusService;
  private readonly auditLogHook: AuditLogHook;

  constructor(options: LifecycleEngineServiceOptions) {
    if (options.tenant_id === "") {
      throw new Error("tenant_id required");
    }
    this.tenant_id = options.tenant_id;
    this.logger = options.logger;
    this.database = options.database;
    this.eventBus = options.eventBus;
    this.auditLogHook = options.auditLogHook;
  }

  async start(context: LifecycleContext): Promise<LifecycleSnapshot> {
    if (context.tenant_id !== this.tenant_id) {
      throw new Error("tenant_id mismatch");
    }
    if (isRoleAllowedForKind(context.kind, context.role) === false) {
      throw new Error("role unauthorized");
    }
    if (context.state !== initialStateForKind(context.kind)) {
      throw new Error("lifecycle transition invalid");
    }
    const snapshot = createLifecycleSnapshot(context, "");
    await this.persistAndEmit(snapshot);
    return snapshot;
  }

  async transition(
    current: LifecycleSnapshot,
    context: LifecycleContext,
    to_state: LifecycleState,
  ): Promise<LifecycleSnapshot> {
    if (context.tenant_id !== this.tenant_id) {
      throw new Error("tenant_id mismatch");
    }
    assertPreconditions(current, context, to_state);

    const nextContext: LifecycleContext = {
      tenant_id: context.tenant_id,
      user_id: context.user_id,
      role: context.role,
      kind: context.kind,
      entity_id: context.entity_id,
      state: to_state,
      timestamp: context.timestamp,
    };
    const next = createLifecycleSnapshot(nextContext, current.state);
    assertInvariants(current, next);
    assertPostconditions(next, to_state, this.tenant_id);
    await this.persistAndEmit(next);
    return next;
  }

  private async persistAndEmit(snapshot: LifecycleSnapshot): Promise<void> {
    this.logger.info("lifecycle.transition");
    this.auditLogHook.write({
      level: "info",
      message: "lifecycle.transition",
      tenant_id: snapshot.tenant_id,
      user_id: snapshot.user_id,
      role: snapshot.role,
      correlation_id: snapshot.entity_id,
      timestamp: snapshot.timestamp,
    });

    const log_id = snapshot.kind + ":" + snapshot.entity_id + ":" + snapshot.state + ":" + snapshot.timestamp;
    const statement = createPreparedStatement(
      "INSERT INTO IntegrationLogs (log_id, tenant_id, event_id, message, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $5, NULL)",
      [
        snapshot.tenant_id,
        log_id,
        log_id,
        JSON.stringify({
          tenant_id: snapshot.tenant_id,
          user_id: snapshot.user_id,
          role: snapshot.role,
          timestamp: snapshot.timestamp,
          action: "lifecycle.transition",
          previous_value: snapshot.previous_state,
          new_value: snapshot.state,
        }),
        snapshot.timestamp,
      ],
    );
    await this.database.execute(statement);
    await this.eventBus.publish(incomingEventFromSnapshot(snapshot));
  }
}
