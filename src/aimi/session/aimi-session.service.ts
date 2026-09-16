/**
 * AIMI Session Layer
 * Master Blueprint V2 / aimi.md §2 / §12
 * Freezes tenant-scoped session state, then hands off to AIMI Context. No global instance.
 */

import type { Database } from "../../core/database/database.interface";
import { createPreparedStatement } from "../../core/database/prepared-statement";
import type { ContextDto } from "../../core/dto/context.dto";
import { createError } from "../../core/errors/error-factory";
import type { ErrorType } from "../../core/errors/error-types";
import type { EventBusService } from "../../core/event-bus/event-bus.service";
import type { LifecycleEngineService } from "../../core/lifecycle-engine/lifecycle-engine.service";
import type { AuditLogHook, Logger } from "../../core/logger/logger.interface";
import { err } from "../../core/results/err";
import { ok } from "../../core/results/ok";
import type { Result } from "../../core/results/result.interface";
import type { ResultContext } from "../../core/results/result-context";
import type { RuleEngineService } from "../../core/rule-engine/rule-engine.service";
import { contextSchema, toRuleContext } from "../../core/validation/context.schema";
import type { AimiCoreService } from "../core/aimi-core.service";
import { buildAimiSession } from "./aimi-session-builder";
import { incomingEventFromAimiSession } from "./aimi-session-events";
import type { AimiSession, AimiSessionSource } from "./aimi-session.interface";

export type AimiSessionServiceOptions = {
  tenant_id: string;
  logger: Logger;
  database: Database;
  eventBus: EventBusService;
  auditLogHook: AuditLogHook;
  ruleEngine: RuleEngineService;
  lifecycleEngine: LifecycleEngineService;
  aimiCore: AimiCoreService;
};

function resultContextFromDto(dto: ContextDto): ResultContext {
  return {
    tenant_id: dto.tenant_id,
    user_id: dto.user_id,
    role: dto.role,
    timestamp: dto.timestamp,
    correlation_id: dto.correlation_id,
    rule_id: dto.rule_id,
    lifecycle_kind: dto.lifecycle_kind,
    from_state: dto.from_state,
    to_state: dto.to_state,
    entity_id: dto.entity_id,
  };
}

export class AimiSessionService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;
  private readonly eventBus: EventBusService;
  private readonly auditLogHook: AuditLogHook;
  private readonly ruleEngine: RuleEngineService;
  private readonly lifecycleEngine: LifecycleEngineService;
  private readonly aimiCore: AimiCoreService;

  constructor(options: AimiSessionServiceOptions) {
    if (options.tenant_id === "") {
      throw new Error("tenant_id required");
    }
    this.tenant_id = options.tenant_id;
    this.logger = options.logger;
    this.database = options.database;
    this.eventBus = options.eventBus;
    this.auditLogHook = options.auditLogHook;
    this.ruleEngine = options.ruleEngine;
    this.lifecycleEngine = options.lifecycleEngine;
    this.aimiCore = options.aimiCore;
  }

  async handle(source: AimiSessionSource, contextInput: unknown): Promise<Result<AimiSession>> {
    const parsed = contextSchema.safeParse(contextInput, this.tenant_id);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType =
        parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      const error = createError(error_type, {
        tenant_id: this.tenant_id,
        user_id: source.user_id,
        role: source.role,
        timestamp: source.timestamp,
        correlation_id: source.event.event_id,
      });
      return err(error, {
        tenant_id: this.tenant_id,
        user_id: source.user_id,
        role: source.role,
        timestamp: source.timestamp,
        correlation_id: source.event.event_id,
        rule_id: "",
        lifecycle_kind: "workorder",
        from_state: "",
        to_state: "",
        entity_id: source.session_id,
      });
    }

    const dto = parsed.data;
    const context = resultContextFromDto(dto);

    if (source.tenant_id !== this.tenant_id) {
      const error = createError("tenant_id mismatch", {
        tenant_id: this.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }
    if (dto.user_id !== source.user_id) {
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }
    if (dto.role !== source.role) {
      const error = createError("role unauthorized", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }

    const rule = await this.ruleEngine.evaluate(toRuleContext(dto));
    if (rule.allowed === false) {
      const error_type: ErrorType =
        rule.error_code === "none" ? "role unauthorized" : rule.error_code;
      const error = createError(error_type, {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }

    const built = buildAimiSession(source);
    if (built.success === false || built.value === null) {
      const error = createError(built.error_code, {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }

    await this.persistSession(built.value.session);

    const core = await this.aimiCore.handle(built.value.session.context, contextInput);
    if (core.ok === false) {
      return err(core.error, context);
    }

    return ok(built.value.session, context);
  }

  private async persistSession(session: AimiSession): Promise<void> {
    const incoming = incomingEventFromAimiSession(session);
    this.logger.info("aimi.session.built");
    this.auditLogHook.write({
      level: "info",
      message: "aimi.session.built",
      tenant_id: session.tenant_id,
      user_id: session.user_id,
      role: session.role,
      correlation_id: session.session_id,
      timestamp: session.timestamp,
    });
    const log_id = incoming.event_id;
    if (log_id === undefined) {
      return;
    }
    const statement = createPreparedStatement(
      "INSERT INTO IntegrationLogs (log_id, tenant_id, event_id, message, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $5, NULL)",
      [
        session.tenant_id,
        log_id,
        log_id,
        JSON.stringify({
          tenant_id: session.tenant_id,
          user_id: session.user_id,
          role: session.role,
          timestamp: session.timestamp,
          action: "aimi.session.built",
          previous_value: session.previous_event_id,
          new_value: session.context.event.event_type,
          session_id: session.session_id,
          engines_selected: session.engines_selected,
        }),
        session.timestamp,
      ],
    );
    await this.database.execute(statement);
  }
}
