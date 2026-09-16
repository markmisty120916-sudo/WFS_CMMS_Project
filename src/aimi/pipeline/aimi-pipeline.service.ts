/**
 * AIMI Deterministic Pipeline
 * Master Blueprint V2 / aimi.md §2 / §12
 * Builds session context, runs AIMI Core in frozen order, merges outputs. No global instance.
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
import { buildAimiPipeline } from "./aimi-pipeline-builder";
import { incomingEventFromAimiPipeline } from "./aimi-pipeline-events";
import { freezeAimiPipeline, type AimiPipeline, type AimiPipelineSource } from "./aimi-pipeline.interface";
import { mergePipelineOutputs } from "./aimi-pipeline-rules";

export type AimiPipelineServiceOptions = {
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

export class AimiPipelineService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;
  private readonly eventBus: EventBusService;
  private readonly auditLogHook: AuditLogHook;
  private readonly ruleEngine: RuleEngineService;
  private readonly lifecycleEngine: LifecycleEngineService;
  private readonly aimiCore: AimiCoreService;

  constructor(options: AimiPipelineServiceOptions) {
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

  async handle(source: AimiPipelineSource, contextInput: unknown): Promise<Result<AimiPipeline>> {
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

    const built = buildAimiPipeline(source);
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

    const core = await this.aimiCore.handle(built.value.session.context, contextInput);
    if (core.ok === false) {
      return err(core.error, context);
    }

    let previous_output = null;
    if (source.previous_pipeline !== null) {
      previous_output = source.previous_pipeline.output;
    }

    const merged = mergePipelineOutputs(
      dto.tenant_id,
      dto.user_id,
      dto.role,
      dto.timestamp,
      built.value.session.context.event.event_id,
      built.value.session.context.event.event_type,
      previous_output,
      core.value,
    );
    if (merged.error_code !== "none" || merged.value === null) {
      const error = createError(merged.error_code, {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }

    const pipeline = freezeAimiPipeline({
      session: built.value.session,
      engines_ordered: built.value.engines_ordered,
      output: merged.value,
    });

    await this.persistPipeline(pipeline);
    return ok(pipeline, context);
  }

  private async persistPipeline(pipeline: AimiPipeline): Promise<void> {
    const incoming = incomingEventFromAimiPipeline(pipeline);
    this.logger.info("aimi.pipeline.built");
    this.auditLogHook.write({
      level: "info",
      message: "aimi.pipeline.built",
      tenant_id: pipeline.session.tenant_id,
      user_id: pipeline.session.user_id,
      role: pipeline.session.role,
      correlation_id: pipeline.session.session_id,
      timestamp: pipeline.session.timestamp,
    });
    const log_id = incoming.event_id;
    if (log_id === undefined) {
      return;
    }
    const statement = createPreparedStatement(
      "INSERT INTO IntegrationLogs (log_id, tenant_id, event_id, message, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $5, NULL)",
      [
        pipeline.session.tenant_id,
        log_id,
        log_id,
        JSON.stringify({
          tenant_id: pipeline.session.tenant_id,
          user_id: pipeline.session.user_id,
          role: pipeline.session.role,
          timestamp: pipeline.session.timestamp,
          action: "aimi.pipeline.built",
          previous_value: pipeline.session.previous_event_id,
          new_value: pipeline.session.context.event.event_type,
          session_id: pipeline.session.session_id,
          engines_ordered: pipeline.engines_ordered,
          engines_run: pipeline.output.engines_run,
        }),
        pipeline.session.timestamp,
      ],
    );
    await this.database.execute(statement);
  }
}
