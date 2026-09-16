/**
 * AIMI Voice NLP Engine
 * Master Blueprint V2 / VOICE-COMMANDS / voice.md
 * Deterministic phoneme mapping into Multilingual NLP. No ML. No global instance.
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
import type { MultilingualNlpEngineService } from "../multilingual-nlp/multilingual-nlp-engine.service";
import type { PredictiveOutput } from "../predictive/predictive-output.interface";
import type { RoutingOutput } from "../routing/routing-output.interface";
import type { SchedulingOutput } from "../scheduling/scheduling-output.interface";
import type { SeverityOutput } from "../severity/severity-output.interface";
import {
  incomingEventFromVoiceFailed,
  incomingEventFromVoiceProcessed,
  incomingEventFromVoiceReceived,
  incomingEventFromVoiceTranslated,
} from "./voice-events";
import type { VoiceInputs } from "./voice-inputs.interface";
import { normalizePhonemeSequence } from "./voice-normalizer";
import { freezeVoiceOutput, freezeVoiceProfile, type VoiceOutput } from "./voice-output.interface";
import { mapVoicePhoneme } from "./voice-phoneme-mapper";
import {
  isRoleAllowedForVoiceCommand,
  isRoleAllowedToSpeak,
  isVoiceProfileImmutable,
} from "./voice-rules";

export type VoiceNlpEngineServiceOptions = {
  tenant_id: string;
  logger: Logger;
  database: Database;
  eventBus: EventBusService;
  auditLogHook: AuditLogHook;
  ruleEngine: RuleEngineService;
  lifecycleEngine: LifecycleEngineService;
  multilingualEngine: MultilingualNlpEngineService;
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

export class VoiceNlpEngineService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;
  private readonly eventBus: EventBusService;
  private readonly auditLogHook: AuditLogHook;
  private readonly ruleEngine: RuleEngineService;
  private readonly lifecycleEngine: LifecycleEngineService;
  private readonly multilingualEngine: MultilingualNlpEngineService;

  constructor(options: VoiceNlpEngineServiceOptions) {
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
    this.multilingualEngine = options.multilingualEngine;
  }

  async process(
    inputs: VoiceInputs,
    severity: SeverityOutput | null,
    routing: RoutingOutput | null,
    scheduling: SchedulingOutput | null,
    predictive: PredictiveOutput | null,
    diagnostics: DiagnosticsOutput | null,
    learning: LearningOutput | null,
    contextInput: unknown,
  ): Promise<Result<VoiceOutput>> {
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
    if (inputs.voice_profile.tenant_id !== this.tenant_id) {
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
    if (inputs.voice_profile.user_id !== dto.user_id) {
      const error = createError("role unauthorized", {
        tenant_id: dto.tenant_id,
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
    if (inputs.voice_profile.language !== inputs.language_profile.language) {
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
    if (isRoleAllowedToSpeak(dto.role) === false) {
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

    if (inputs.meets_confidence_threshold === false) {
      await this.eventBus.publish(incomingEventFromVoiceFailed(
        dto.tenant_id,
        dto.user_id,
        dto.role,
        dto.timestamp,
        inputs.workorder_id,
        "",
        inputs.voice_profile.language,
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

    const normalized_phonemes = normalizePhonemeSequence(inputs.phoneme_sequence);
    const match = mapVoicePhoneme(
      normalized_phonemes,
      this.tenant_id,
      inputs.voice_profile.language,
      inputs.phoneme_catalog,
    );
    if (match === null) {
      await this.eventBus.publish(incomingEventFromVoiceFailed(
        dto.tenant_id,
        dto.user_id,
        dto.role,
        dto.timestamp,
        inputs.workorder_id,
        "",
        inputs.voice_profile.language,
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
    if (isRoleAllowedForVoiceCommand(dto.role, match.entry.command_type) === false) {
      const error = createError("role unauthorized", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }

    const multilingual = await this.multilingualEngine.translate({
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      timestamp: dto.timestamp,
      workorder_id: inputs.workorder_id,
      asset_id: inputs.asset_id,
      technician_id: inputs.technician_id,
      original_text: match.entry.source_token,
      source: "voice",
      language_profile: inputs.language_profile,
      dictionary: inputs.dictionary,
    }, severity, routing, scheduling, predictive, diagnostics, learning, contextInput);
    if (multilingual.ok === false) {
      await this.eventBus.publish(incomingEventFromVoiceFailed(
        dto.tenant_id,
        dto.user_id,
        dto.role,
        dto.timestamp,
        inputs.workorder_id,
        match.entry.source_token,
        inputs.voice_profile.language,
      ));
      return err(multilingual.error, context);
    }

    const profile = freezeVoiceProfile(inputs.voice_profile);
    const output = freezeVoiceOutput({
      original_text: match.entry.source_token,
      translated_text: multilingual.value.translated_text,
      detected_language: multilingual.value.detected_language,
      normalized_phonemes,
      command_type: match.entry.command_type,
      command_category: match.entry.command_category,
      command_target: match.entry.command_target,
      command_parameter: match.entry.command_parameter,
      source: inputs.voice_profile.source,
      voice_profile: profile,
      voice_inputs: inputs,
      voice_timestamp: dto.timestamp,
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
    });
    if (isVoiceProfileImmutable(inputs.voice_profile, output.voice_profile) === false) {
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }

    await this.persistAndEmit(output, incomingEventFromVoiceReceived(output), "voice.command.received");
    await this.eventBus.publish(incomingEventFromVoiceTranslated(output));
    await this.eventBus.publish(incomingEventFromVoiceProcessed(output));
    return ok(output, context);
  }

  private async persistAndEmit(
    output: VoiceOutput,
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
      correlation_id: output.voice_inputs.workorder_id,
      timestamp: output.voice_timestamp,
    });
    const log_id = output.voice_inputs.workorder_id + ":" + output.command_type + ":" + output.voice_timestamp;
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
          timestamp: output.voice_timestamp,
          action,
          previous_value: output.original_text,
          new_value: output.translated_text,
        }),
        output.voice_timestamp,
      ],
    );
    await this.database.execute(statement);
    await this.eventBus.publish(incoming);
  }
}
