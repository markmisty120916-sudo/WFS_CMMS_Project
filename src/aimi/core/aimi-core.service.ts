/**
 * AIMI Core
 * Master Blueprint V2 / aimi.md §2 / §12
 * Distributes events to engines, then aggregates. No global instance.
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
import type { DiagnosticsEngineService } from "../diagnostics/diagnostics-engine.service";
import type { DiagnosticsOutput } from "../diagnostics/diagnostics-output.interface";
import type { LearningEngineService } from "../learning/learning-engine.service";
import type { LearningOutput } from "../learning/learning-output.interface";
import type { MultilingualNlpEngineService } from "../multilingual-nlp/multilingual-nlp-engine.service";
import type { MultilingualOutput } from "../multilingual-nlp/multilingual-output.interface";
import type { PredictiveEngineService } from "../predictive/predictive-engine.service";
import type { PredictiveOutput } from "../predictive/predictive-output.interface";
import type { RoutingEngineService } from "../routing/routing-engine.service";
import type { RoutingOutput } from "../routing/routing-output.interface";
import type { SchedulingEngineService } from "../scheduling/scheduling-engine.service";
import type { SchedulingOutput } from "../scheduling/scheduling-output.interface";
import type { SeverityEngineService } from "../severity/severity-engine.service";
import type { SeverityOutput } from "../severity/severity-output.interface";
import type { VoiceNlpEngineService } from "../voice-nlp/voice-nlp-engine.service";
import type { VoiceOutput } from "../voice-nlp/voice-output.interface";
import { aggregateAimiCore } from "./aimi-core-aggregator";
import type { AimiCoreContext } from "./aimi-core-context.interface";
import { sequenceEngines, type AimiEngineName } from "./aimi-core-engine-map";
import { enginesForEventType } from "./aimi-core-event-router";
import { incomingEventFromAimiCore } from "./aimi-core-events";
import type { AimiCoreOutput } from "./aimi-core-output.interface";
import {
  filterEnginesForRole,
  impactAreaFromEngines,
  insightSeverityFromSeverity,
  insightTypeFromEventType,
} from "./aimi-core-rules";

export type AimiCoreServiceOptions = {
  tenant_id: string;
  logger: Logger;
  database: Database;
  eventBus: EventBusService;
  auditLogHook: AuditLogHook;
  ruleEngine: RuleEngineService;
  lifecycleEngine: LifecycleEngineService;
  severityEngine: SeverityEngineService;
  routingEngine: RoutingEngineService;
  schedulingEngine: SchedulingEngineService;
  predictiveEngine: PredictiveEngineService;
  diagnosticsEngine: DiagnosticsEngineService;
  learningEngine: LearningEngineService;
  multilingualEngine: MultilingualNlpEngineService;
  voiceEngine: VoiceNlpEngineService;
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

export class AimiCoreService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;
  private readonly eventBus: EventBusService;
  private readonly auditLogHook: AuditLogHook;
  private readonly ruleEngine: RuleEngineService;
  private readonly lifecycleEngine: LifecycleEngineService;
  private readonly severityEngine: SeverityEngineService;
  private readonly routingEngine: RoutingEngineService;
  private readonly schedulingEngine: SchedulingEngineService;
  private readonly predictiveEngine: PredictiveEngineService;
  private readonly diagnosticsEngine: DiagnosticsEngineService;
  private readonly learningEngine: LearningEngineService;
  private readonly multilingualEngine: MultilingualNlpEngineService;
  private readonly voiceEngine: VoiceNlpEngineService;

  constructor(options: AimiCoreServiceOptions) {
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
    this.severityEngine = options.severityEngine;
    this.routingEngine = options.routingEngine;
    this.schedulingEngine = options.schedulingEngine;
    this.predictiveEngine = options.predictiveEngine;
    this.diagnosticsEngine = options.diagnosticsEngine;
    this.learningEngine = options.learningEngine;
    this.multilingualEngine = options.multilingualEngine;
    this.voiceEngine = options.voiceEngine;
  }

  async handle(coreContext: AimiCoreContext, contextInput: unknown): Promise<Result<AimiCoreOutput>> {
    const parsed = contextSchema.safeParse(contextInput, this.tenant_id);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType =
        parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      const error = createError(error_type, {
        tenant_id: this.tenant_id,
        user_id: coreContext.user_id,
        role: coreContext.role,
        timestamp: coreContext.timestamp,
        correlation_id: coreContext.event.event_id,
      });
      return err(error, {
        tenant_id: this.tenant_id,
        user_id: coreContext.user_id,
        role: coreContext.role,
        timestamp: coreContext.timestamp,
        correlation_id: coreContext.event.event_id,
        rule_id: "",
        lifecycle_kind: "workorder",
        from_state: "",
        to_state: "",
        entity_id: coreContext.event.event_id,
      });
    }

    const dto = parsed.data;
    const context = resultContextFromDto(dto);

    if (coreContext.tenant_id !== this.tenant_id) {
      const error = createError("tenant_id mismatch", {
        tenant_id: this.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }
    if (coreContext.event.tenant_id !== this.tenant_id) {
      const error = createError("tenant_id mismatch", {
        tenant_id: this.tenant_id,
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

    const mapped = enginesForEventType(coreContext.event.event_type);
    const allowed = filterEnginesForRole(mapped, dto.role);
    const sequenced = sequenceEngines(allowed);

    let severity: SeverityOutput | null = coreContext.prior_severity;
    let routing: RoutingOutput | null = coreContext.prior_routing;
    let scheduling: SchedulingOutput | null = coreContext.prior_scheduling;
    let predictive: PredictiveOutput | null = coreContext.prior_predictive;
    let diagnostics: DiagnosticsOutput | null = coreContext.prior_diagnostics;
    let learning: LearningOutput | null = coreContext.prior_learning;
    let multilingual: MultilingualOutput | null = coreContext.prior_multilingual;
    let voice: VoiceOutput | null = coreContext.prior_voice;
    const engines_run: AimiEngineName[] = [];

    let sequence_index = 0;
    while (sequence_index < sequenced.length) {
      const engine = sequenced[sequence_index];
      sequence_index = sequence_index + 1;
      if (engine === "VoiceNlpEngine") {
        if (coreContext.voice_inputs === null) {
          const error = createError("dto invalid", {
            tenant_id: dto.tenant_id,
            user_id: dto.user_id,
            role: dto.role,
            timestamp: dto.timestamp,
            correlation_id: dto.correlation_id,
          });
          return err(error, context);
        }
        const result = await this.voiceEngine.process(
          coreContext.voice_inputs,
          severity,
          routing,
          scheduling,
          predictive,
          diagnostics,
          learning,
          contextInput,
        );
        if (result.ok === false) {
          return err(result.error, context);
        }
        voice = result.value;
        engines_run.push(engine);
      }
      if (engine === "MultilingualNlpEngine") {
        if (coreContext.multilingual_inputs === null) {
          const error = createError("dto invalid", {
            tenant_id: dto.tenant_id,
            user_id: dto.user_id,
            role: dto.role,
            timestamp: dto.timestamp,
            correlation_id: dto.correlation_id,
          });
          return err(error, context);
        }
        const result = await this.multilingualEngine.translate(
          coreContext.multilingual_inputs,
          severity,
          routing,
          scheduling,
          predictive,
          diagnostics,
          learning,
          contextInput,
        );
        if (result.ok === false) {
          return err(result.error, context);
        }
        multilingual = result.value;
        engines_run.push(engine);
      }
      if (engine === "SeverityEngine") {
        if (coreContext.severity_inputs === null) {
          const error = createError("dto invalid", {
            tenant_id: dto.tenant_id,
            user_id: dto.user_id,
            role: dto.role,
            timestamp: dto.timestamp,
            correlation_id: dto.correlation_id,
          });
          return err(error, context);
        }
        const result = await this.severityEngine.classify(
          coreContext.severity_inputs,
          contextInput,
          coreContext.workorder_snapshot,
        );
        if (result.ok === false) {
          return err(result.error, context);
        }
        severity = result.value;
        engines_run.push(engine);
      }
      if (engine === "PredictiveEngine") {
        if (coreContext.predictive_inputs === null) {
          const error = createError("dto invalid", {
            tenant_id: dto.tenant_id,
            user_id: dto.user_id,
            role: dto.role,
            timestamp: dto.timestamp,
            correlation_id: dto.correlation_id,
          });
          return err(error, context);
        }
        const result = await this.predictiveEngine.forecast(
          coreContext.predictive_inputs,
          severity,
          routing,
          scheduling,
          coreContext.prior_predictive,
          contextInput,
          coreContext.pm_snapshot,
        );
        if (result.ok === false) {
          return err(result.error, context);
        }
        predictive = result.value;
        engines_run.push(engine);
      }
      if (engine === "RoutingEngine") {
        if (coreContext.routing_inputs === null || severity === null) {
          const error = createError("dto invalid", {
            tenant_id: dto.tenant_id,
            user_id: dto.user_id,
            role: dto.role,
            timestamp: dto.timestamp,
            correlation_id: dto.correlation_id,
          });
          return err(error, context);
        }
        const result = await this.routingEngine.assign(
          coreContext.routing_inputs,
          severity,
          contextInput,
          coreContext.workorder_snapshot,
        );
        if (result.ok === false) {
          return err(result.error, context);
        }
        routing = result.value;
        engines_run.push(engine);
      }
      if (engine === "SchedulingEngine") {
        if (coreContext.scheduling_inputs === null || severity === null || routing === null) {
          const error = createError("dto invalid", {
            tenant_id: dto.tenant_id,
            user_id: dto.user_id,
            role: dto.role,
            timestamp: dto.timestamp,
            correlation_id: dto.correlation_id,
          });
          return err(error, context);
        }
        const result = await this.schedulingEngine.assign(
          coreContext.scheduling_inputs,
          severity,
          routing,
          contextInput,
          coreContext.workorder_snapshot,
        );
        if (result.ok === false) {
          return err(result.error, context);
        }
        scheduling = result.value;
        engines_run.push(engine);
      }
      if (engine === "DiagnosticEngine") {
        if (coreContext.diagnostic_inputs === null) {
          const error = createError("dto invalid", {
            tenant_id: dto.tenant_id,
            user_id: dto.user_id,
            role: dto.role,
            timestamp: dto.timestamp,
            correlation_id: dto.correlation_id,
          });
          return err(error, context);
        }
        const result = await this.diagnosticsEngine.start(
          coreContext.diagnostic_inputs,
          severity,
          routing,
          scheduling,
          predictive,
          contextInput,
          coreContext.diagnostic_snapshot,
        );
        if (result.ok === false) {
          return err(result.error, context);
        }
        diagnostics = result.value;
        engines_run.push(engine);
      }
      if (engine === "LearningEngine") {
        if (coreContext.learning_inputs === null) {
          const error = createError("dto invalid", {
            tenant_id: dto.tenant_id,
            user_id: dto.user_id,
            role: dto.role,
            timestamp: dto.timestamp,
            correlation_id: dto.correlation_id,
          });
          return err(error, context);
        }
        const result = await this.learningEngine.generate(
          coreContext.learning_inputs,
          severity,
          routing,
          scheduling,
          predictive,
          diagnostics,
          contextInput,
          coreContext.diagnostic_snapshot,
        );
        if (result.ok === false) {
          return err(result.error, context);
        }
        learning = result.value;
        engines_run.push(engine);
      }
    }

    const output = aggregateAimiCore({
      event_id: coreContext.event.event_id,
      event_type: coreContext.event.event_type,
      engines_run,
      severity,
      routing,
      scheduling,
      predictive,
      diagnostics,
      learning,
      multilingual,
      voice,
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      timestamp: dto.timestamp,
    });

    if (engines_run.length > 0) {
      let severity_label: string | null = null;
      if (severity !== null) {
        severity_label = severity.severity;
      }
      await this.persistAndEmit(
        output,
        incomingEventFromAimiCore(
          output,
          insightTypeFromEventType(output.event_type),
          insightSeverityFromSeverity(severity_label),
          impactAreaFromEngines(engines_run),
        ),
        "aimi.insight.generated",
      );
    }

    return ok(output, context);
  }

  private async persistAndEmit(
    output: AimiCoreOutput,
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
      correlation_id: output.event_id,
      timestamp: output.timestamp,
    });
    const log_id = output.event_id + ":aimi-core:" + output.timestamp;
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
          timestamp: output.timestamp,
          action,
          previous_value: "",
          new_value: output.event_type,
        }),
        output.timestamp,
      ],
    );
    await this.database.execute(statement);
    await this.eventBus.publish(incoming);
  }
}
