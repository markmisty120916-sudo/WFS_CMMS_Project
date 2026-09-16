/**
 * AIMI Output Normalizer
 * Master Blueprint V2 / aimi.md §12 / EVENT-BUS-SPEC §4
 * Runs the deterministic pipeline, then seals outputs. No global instance.
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
import type { AimiPipelineService } from "../pipeline/aimi-pipeline.service";
import type { AimiPipelineSource } from "../pipeline/aimi-pipeline.interface";
import { buildAimiOutputNormalizer } from "./aimi-output-normalizer-builder";
import { incomingEventFromAimiNormalizedOutput } from "./aimi-output-normalizer-events";
import type { AimiNormalizedOutput } from "./aimi-output-normalizer.interface";

export type AimiOutputNormalizerServiceOptions = {
  tenant_id: string;
  logger: Logger;
  database: Database;
  eventBus: EventBusService;
  auditLogHook: AuditLogHook;
  ruleEngine: RuleEngineService;
  lifecycleEngine: LifecycleEngineService;
  aimiPipeline: AimiPipelineService;
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

export class AimiOutputNormalizerService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;
  private readonly eventBus: EventBusService;
  private readonly auditLogHook: AuditLogHook;
  private readonly ruleEngine: RuleEngineService;
  private readonly lifecycleEngine: LifecycleEngineService;
  private readonly aimiPipeline: AimiPipelineService;

  constructor(options: AimiOutputNormalizerServiceOptions) {
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
    this.aimiPipeline = options.aimiPipeline;
  }

  async handle(
    source: AimiPipelineSource,
    contextInput: unknown,
  ): Promise<Result<AimiNormalizedOutput>> {
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

    const pipeline = await this.aimiPipeline.handle(source, contextInput);
    if (pipeline.ok === false) {
      return err(pipeline.error, context);
    }

    const built = buildAimiOutputNormalizer(pipeline.value);
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

    await this.persistNormalized(built.value);
    return ok(built.value, context);
  }

  private async persistNormalized(envelope: AimiNormalizedOutput): Promise<void> {
    const incoming = incomingEventFromAimiNormalizedOutput(envelope);
    this.logger.info("aimi.output.normalized");
    this.auditLogHook.write({
      level: "info",
      message: "aimi.output.normalized",
      tenant_id: envelope.tenant_id,
      user_id: envelope.user_id,
      role: envelope.role,
      correlation_id: envelope.session_id,
      timestamp: envelope.timestamp,
    });
    const log_id = incoming.event_id;
    if (log_id === undefined) {
      return;
    }
    const statement = createPreparedStatement(
      "INSERT INTO IntegrationLogs (log_id, tenant_id, event_id, message, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $5, NULL)",
      [
        envelope.tenant_id,
        log_id,
        log_id,
        JSON.stringify({
          tenant_id: envelope.tenant_id,
          user_id: envelope.user_id,
          role: envelope.role,
          timestamp: envelope.timestamp,
          action: "aimi.output.normalized",
          previous_value: "",
          new_value: envelope.event_type,
          session_id: envelope.session_id,
          engines_run: envelope.engines_run,
          insight_type: envelope.insight_type,
          insight_severity: envelope.insight_severity,
          impact_area: envelope.impact_area,
        }),
        envelope.timestamp,
      ],
    );
    await this.database.execute(statement);
  }
}
