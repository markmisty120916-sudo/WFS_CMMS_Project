/**
 * AIMI Learning Engine
 * Master Blueprint V2 / AIMI-LEARNING
 * Deterministic insight proposals. Weights never mutated. No global instance.
 */

import type { Database } from "../../core/database/database.interface";
import { createPreparedStatement } from "../../core/database/prepared-statement";
import type { ContextDto } from "../../core/dto/context.dto";
import { createError } from "../../core/errors/error-factory";
import type { ErrorType } from "../../core/errors/error-types";
import type { EventBusService } from "../../core/event-bus/event-bus.service";
import type { IncomingEvent } from "../../core/event-bus/event.interface";
import type { LifecycleEngineService } from "../../core/lifecycle-engine/lifecycle-engine.service";
import { isRoleAllowedForKind } from "../../core/lifecycle-engine/lifecycle-guards";
import type { LifecycleSnapshot } from "../../core/lifecycle-engine/lifecycle-snapshot";
import type { AuditLogHook, Logger } from "../../core/logger/logger.interface";
import { err } from "../../core/results/err";
import { ok } from "../../core/results/ok";
import type { Result } from "../../core/results/result.interface";
import type { ResultContext } from "../../core/results/result-context";
import type { RuleEngineService } from "../../core/rule-engine/rule-engine.service";
import { contextSchema, toRuleContext } from "../../core/validation/context.schema";
import type { DiagnosticsOutput } from "../diagnostics/diagnostics-output.interface";
import type { PredictiveOutput } from "../predictive/predictive-output.interface";
import type { RoutingOutput } from "../routing/routing-output.interface";
import type { SchedulingOutput } from "../scheduling/scheduling-output.interface";
import type { SeverityOutput } from "../severity/severity-output.interface";
import {
  incomingEventFromLearningApplied,
  incomingEventFromLearningApproved,
  incomingEventFromLearningGenerated,
} from "./learning-events";
import type { LearningInputs } from "./learning-inputs.interface";
import { freezeLearningOutput, freezeLearningWeights, type LearningOutput } from "./learning-output.interface";
import {
  areWeightsImmutable,
  isRoleAllowedToApproveLearning,
  isRoleAllowedToGenerateLearning,
  weightsAreTenantScoped,
} from "./learning-rules";
import { evaluateLearningUpdateTree } from "./learning-update-tree";

export type LearningEngineServiceOptions = {
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

export class LearningEngineService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;
  private readonly eventBus: EventBusService;
  private readonly auditLogHook: AuditLogHook;
  private readonly ruleEngine: RuleEngineService;
  private readonly lifecycleEngine: LifecycleEngineService;

  constructor(options: LearningEngineServiceOptions) {
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

  async generate(
    inputs: LearningInputs,
    severity: SeverityOutput | null,
    routing: RoutingOutput | null,
    scheduling: SchedulingOutput | null,
    predictive: PredictiveOutput | null,
    diagnostics: DiagnosticsOutput | null,
    contextInput: unknown,
    snapshot: LifecycleSnapshot | null,
  ): Promise<Result<LearningOutput>> {
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
    if (weightsAreTenantScoped(inputs.weights, this.tenant_id) === false) {
      const error = createError("tenant_id mismatch", {
        tenant_id: this.tenant_id,
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
    if (isRoleAllowedToGenerateLearning(dto.role) === false) {
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

    const match = evaluateLearningUpdateTree(inputs);
    if (match === null) {
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }

    const output = freezeLearningOutput({
      learning_insight_id: inputs.workorder_id + ":" + inputs.insight_type + ":" + dto.timestamp,
      insight_type: inputs.insight_type,
      insight_summary: match.insight_summary,
      recommended_action: match.recommended_action,
      impact_area: match.impact_area,
      approval_status: "pending",
      approval_reason: "",
      learning_inputs: inputs,
      learning_weights: freezeLearningWeights(inputs.weights),
      learning_timestamp: dto.timestamp,
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
    });

    await this.persistAndEmit(output, incomingEventFromLearningGenerated(output), "aimi.learning.insight.generated");

    if (snapshot !== null) {
      if (snapshot.kind === "diagnostic") {
        if (isRoleAllowedForKind("diagnostic", dto.role) === true) {
          if (snapshot.state === "STEP_BY_STEP_TROUBLESHOOTING") {
            await this.lifecycleEngine.transition(snapshot, {
              tenant_id: dto.tenant_id,
              user_id: dto.user_id,
              role: dto.role,
              kind: "diagnostic",
              entity_id: snapshot.entity_id,
              state: "STEP_BY_STEP_TROUBLESHOOTING",
              timestamp: dto.timestamp,
            }, "TECHNICIAN_LEARNING_CAPTURE");
          }
        }
      }
    }

    return ok(output, context);
  }

  async approve(
    current: LearningOutput,
    approval_reason: string,
    contextInput: unknown,
  ): Promise<Result<LearningOutput>> {
    const parsed = contextSchema.safeParse(contextInput, this.tenant_id);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType =
        parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      const error = createError(error_type, {
        tenant_id: this.tenant_id,
        user_id: current.user_id,
        role: current.role,
        timestamp: current.learning_timestamp,
        correlation_id: current.learning_insight_id,
      });
      return err(error, {
        tenant_id: this.tenant_id,
        user_id: current.user_id,
        role: current.role,
        timestamp: current.learning_timestamp,
        correlation_id: current.learning_insight_id,
        rule_id: "",
        lifecycle_kind: "diagnostic",
        from_state: "",
        to_state: "",
        entity_id: current.learning_inputs.workorder_id,
      });
    }
    const dto = parsed.data;
    const context = resultContextFromDto(dto);
    if (isRoleAllowedToApproveLearning(dto.role) === false) {
      const error = createError("role unauthorized", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }
    if (approval_reason === "") {
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }
    if (current.tenant_id !== this.tenant_id) {
      const error = createError("tenant_id mismatch", {
        tenant_id: this.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }
    if (current.approval_status !== "pending") {
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }

    const output = freezeLearningOutput({
      learning_insight_id: current.learning_insight_id,
      insight_type: current.insight_type,
      insight_summary: current.insight_summary,
      recommended_action: current.recommended_action,
      impact_area: current.impact_area,
      approval_status: "approved",
      approval_reason,
      learning_inputs: current.learning_inputs,
      learning_weights: current.learning_weights,
      learning_timestamp: dto.timestamp,
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
    });
    if (areWeightsImmutable(current.learning_weights, output.learning_weights) === false) {
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }
    await this.persistAndEmit(output, incomingEventFromLearningApproved(output), "aimi.learning.insight.approved");
    return ok(output, context);
  }

  async apply(
    current: LearningOutput,
    contextInput: unknown,
    snapshot: LifecycleSnapshot | null,
  ): Promise<Result<LearningOutput>> {
    const parsed = contextSchema.safeParse(contextInput, this.tenant_id);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType =
        parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      const error = createError(error_type, {
        tenant_id: this.tenant_id,
        user_id: current.user_id,
        role: current.role,
        timestamp: current.learning_timestamp,
        correlation_id: current.learning_insight_id,
      });
      return err(error, {
        tenant_id: this.tenant_id,
        user_id: current.user_id,
        role: current.role,
        timestamp: current.learning_timestamp,
        correlation_id: current.learning_insight_id,
        rule_id: "",
        lifecycle_kind: "diagnostic",
        from_state: "",
        to_state: "",
        entity_id: current.learning_inputs.workorder_id,
      });
    }
    const dto = parsed.data;
    const context = resultContextFromDto(dto);
    if (isRoleAllowedToApproveLearning(dto.role) === false) {
      const error = createError("role unauthorized", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }
    if (current.tenant_id !== this.tenant_id) {
      const error = createError("tenant_id mismatch", {
        tenant_id: this.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }
    if (current.approval_status !== "approved") {
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }

    const output = freezeLearningOutput({
      learning_insight_id: current.learning_insight_id,
      insight_type: current.insight_type,
      insight_summary: current.insight_summary,
      recommended_action: current.recommended_action,
      impact_area: current.impact_area,
      approval_status: "applied",
      approval_reason: current.approval_reason,
      learning_inputs: current.learning_inputs,
      learning_weights: current.learning_weights,
      learning_timestamp: dto.timestamp,
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
    });
    if (areWeightsImmutable(current.learning_weights, output.learning_weights) === false) {
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }
    await this.persistAndEmit(output, incomingEventFromLearningApplied(output), "aimi.learning.insight.applied");
    if (snapshot !== null) {
      if (snapshot.kind === "diagnostic") {
        if (isRoleAllowedForKind("diagnostic", dto.role) === true) {
          if (snapshot.state === "TECHNICIAN_LEARNING_CAPTURE") {
            await this.lifecycleEngine.transition(snapshot, {
              tenant_id: dto.tenant_id,
              user_id: dto.user_id,
              role: dto.role,
              kind: "diagnostic",
              entity_id: snapshot.entity_id,
              state: "TECHNICIAN_LEARNING_CAPTURE",
              timestamp: dto.timestamp,
            }, "REPAIR_RECOMMENDATION");
          }
        }
      }
    }
    return ok(output, context);
  }

  private async persistAndEmit(
    output: LearningOutput,
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
      correlation_id: output.learning_insight_id,
      timestamp: output.learning_timestamp,
    });
    const log_id = output.learning_insight_id + ":" + output.approval_status + ":" + output.learning_timestamp;
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
          timestamp: output.learning_timestamp,
          action,
          previous_value: "",
          new_value: output.recommended_action,
        }),
        output.learning_timestamp,
      ],
    );
    await this.database.execute(statement);
    await this.eventBus.publish(incoming);
  }
}
