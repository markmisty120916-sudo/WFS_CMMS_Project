/**
 * AIMI Multilingual NLP Engine
 * Master Blueprint V2 / multilingual.md
 * Deterministic dictionary translation. No ML. No global instance.
 */

import type { Database } from "../../core/database/database.interface";
import { createPreparedStatement } from "../../core/database/prepared-statement";
import type { ContextDto } from "../../core/dto/context.dto";
import { createError } from "../../core/errors/error-factory";
import type { ErrorType } from "../../core/errors/error-types";
import type { EventBusService } from "../../core/event-bus/event-bus.service";
import type { IncomingEvent } from "../../core/event-bus/event.interface";
import type { LifecycleEngineService } from "../../core/lifecycle-engine/lifecycle-engine.service";
import type { AuditLogHook, Logger } from "../../core/logger/logger.interface";
import { err } from "../../core/results/err";
import { ok } from "../../core/results/ok";
import type { Result } from "../../core/results/result.interface";
import type { ResultContext } from "../../core/results/result-context";
import type { RuleEngineService } from "../../core/rule-engine/rule-engine.service";
import { contextSchema, toRuleContext } from "../../core/validation/context.schema";
import type { DiagnosticsOutput } from "../diagnostics/diagnostics-output.interface";
import type { LearningOutput } from "../learning/learning-output.interface";
import type { PredictiveOutput } from "../predictive/predictive-output.interface";
import type { RoutingOutput } from "../routing/routing-output.interface";
import type { SchedulingOutput } from "../scheduling/scheduling-output.interface";
import type { SeverityOutput } from "../severity/severity-output.interface";
import {
  incomingEventFromMultilingualFailed,
  incomingEventFromMultilingualProcessed,
  incomingEventFromMultilingualTranslated,
} from "./multilingual-events";
import type { MultilingualInputs } from "./multilingual-inputs.interface";
import { normalizeMultilingualText } from "./multilingual-normalizer";
import {
  freezeLanguageProfile,
  freezeMultilingualOutput,
  type MultilingualOutput,
} from "./multilingual-output.interface";
import {
  isLanguageProfileImmutable,
  isRoleAllowedToTranslate,
  isSupportedLanguage,
} from "./multilingual-rules";
import { mapMultilingualToken } from "./multilingual-token-mapper";

export type MultilingualNlpEngineServiceOptions = {
  tenant_id: string;
  logger: Logger;
  database: Database;
  eventBus: EventBusService;
  auditLogHook: AuditLogHook;
  ruleEngine: RuleEngineService;
  lifecycleEngine: LifecycleEngineService;
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

export class MultilingualNlpEngineService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;
  private readonly eventBus: EventBusService;
  private readonly auditLogHook: AuditLogHook;
  private readonly ruleEngine: RuleEngineService;
  private readonly lifecycleEngine: LifecycleEngineService;

  constructor(options: MultilingualNlpEngineServiceOptions) {
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
  }

  async translate(
    inputs: MultilingualInputs,
    severity: SeverityOutput | null,
    routing: RoutingOutput | null,
    scheduling: SchedulingOutput | null,
    predictive: PredictiveOutput | null,
    diagnostics: DiagnosticsOutput | null,
    learning: LearningOutput | null,
    contextInput: unknown,
  ): Promise<Result<MultilingualOutput>> {
    const parsed = contextSchema.safeParse(contextInput, this.tenant_id);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType =
        parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      const error = createError(error_type, {
        tenant_id: this.tenant_id,
        user_id: inputs.user_id,
        role: inputs.role,
        timestamp: inputs.timestamp,
        correlation_id: inputs.workorder_id,
      });
      return err(error, {
        tenant_id: this.tenant_id,
        user_id: inputs.user_id,
        role: inputs.role,
        timestamp: inputs.timestamp,
        correlation_id: inputs.workorder_id,
        rule_id: "",
        lifecycle_kind: "diagnostic",
        from_state: "",
        to_state: "",
        entity_id: inputs.workorder_id,
      });
    }

    const dto = parsed.data;
    const context = resultContextFromDto(dto);

    if (inputs.tenant_id !== this.tenant_id) {
      const error = createError("tenant_id mismatch", {
        tenant_id: this.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }
    if (inputs.language_profile.tenant_id !== this.tenant_id) {
      const error = createError("tenant_id mismatch", {
        tenant_id: this.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }
    if (inputs.language_profile.user_id !== dto.user_id) {
      const error = createError("role unauthorized", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }
    if (isSupportedLanguage(inputs.language_profile.language) === false) {
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }
    if (severity !== null) {
      if (severity.tenant_id !== this.tenant_id) {
        const error = createError("tenant_id mismatch", {
          tenant_id: this.tenant_id,
          user_id: dto.user_id,
          role: dto.role,
          timestamp: dto.timestamp,
          correlation_id: dto.correlation_id,
        });
        return err(error, context);
      }
    }
    if (routing !== null) {
      if (routing.tenant_id !== this.tenant_id) {
        const error = createError("tenant_id mismatch", {
          tenant_id: this.tenant_id,
          user_id: dto.user_id,
          role: dto.role,
          timestamp: dto.timestamp,
          correlation_id: dto.correlation_id,
        });
        return err(error, context);
      }
    }
    if (scheduling !== null) {
      if (scheduling.tenant_id !== this.tenant_id) {
        const error = createError("tenant_id mismatch", {
          tenant_id: this.tenant_id,
          user_id: dto.user_id,
          role: dto.role,
          timestamp: dto.timestamp,
          correlation_id: dto.correlation_id,
        });
        return err(error, context);
      }
    }
    if (predictive !== null) {
      if (predictive.tenant_id !== this.tenant_id) {
        const error = createError("tenant_id mismatch", {
          tenant_id: this.tenant_id,
          user_id: dto.user_id,
          role: dto.role,
          timestamp: dto.timestamp,
          correlation_id: dto.correlation_id,
        });
        return err(error, context);
      }
    }
    if (diagnostics !== null) {
      if (diagnostics.tenant_id !== this.tenant_id) {
        const error = createError("tenant_id mismatch", {
          tenant_id: this.tenant_id,
          user_id: dto.user_id,
          role: dto.role,
          timestamp: dto.timestamp,
          correlation_id: dto.correlation_id,
        });
        return err(error, context);
      }
    }
    if (learning !== null) {
      if (learning.tenant_id !== this.tenant_id) {
        const error = createError("tenant_id mismatch", {
          tenant_id: this.tenant_id,
          user_id: dto.user_id,
          role: dto.role,
          timestamp: dto.timestamp,
          correlation_id: dto.correlation_id,
        });
        return err(error, context);
      }
    }
    if (isRoleAllowedToTranslate(dto.role) === false) {
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

    const normalized_text = normalizeMultilingualText(inputs.original_text);
    const match = mapMultilingualToken(
      normalized_text,
      this.tenant_id,
      inputs.language_profile.language,
      inputs.dictionary,
    );
    if (match === null) {
      await this.eventBus.publish(incomingEventFromMultilingualFailed(
        dto.tenant_id,
        dto.user_id,
        dto.role,
        dto.timestamp,
        inputs.workorder_id,
        inputs.original_text,
        inputs.language_profile.language,
      ));
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }

    const profile = freezeLanguageProfile(inputs.language_profile);
    const output = freezeMultilingualOutput({
      original_text: inputs.original_text,
      translated_text: match.entry.internal_token,
      detected_language: inputs.language_profile.language,
      normalized_text,
      command_type: match.entry.command_type,
      command_target: match.entry.command_target,
      command_parameter: match.entry.command_parameter,
      source: inputs.source,
      language_profile: profile,
      multilingual_inputs: inputs,
      multilingual_timestamp: dto.timestamp,
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
    });
    if (isLanguageProfileImmutable(inputs.language_profile, output.language_profile) === false) {
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }

    await this.persistAndEmit(output, incomingEventFromMultilingualTranslated(output), "voice.command.translated");
    await this.eventBus.publish(incomingEventFromMultilingualProcessed(output));
    return ok(output, context);
  }

  private async persistAndEmit(
    output: MultilingualOutput,
    incoming: IncomingEvent,
    action: string,
  ): Promise<void> {
    this.logger.info(action);
    this.auditLogHook.write({
      level: "info",
      message: action,
      tenant_id: output.tenant_id,
      user_id: output.user_id,
      role: output.role,
      correlation_id: output.multilingual_inputs.workorder_id,
      timestamp: output.multilingual_timestamp,
    });
    const log_id = output.multilingual_inputs.workorder_id + ":" + output.detected_language + ":" + output.multilingual_timestamp;
    const statement = createPreparedStatement(
      "INSERT INTO IntegrationLogs (log_id, tenant_id, event_id, message, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $5, NULL)",
      [
        output.tenant_id,
        log_id,
        log_id,
        JSON.stringify({
          tenant_id: output.tenant_id,
          user_id: output.user_id,
          role: output.role,
          timestamp: output.multilingual_timestamp,
          action,
          previous_value: output.original_text,
          new_value: output.translated_text,
        }),
        output.multilingual_timestamp,
      ],
    );
    await this.database.execute(statement);
    await this.eventBus.publish(incoming);
  }
}
