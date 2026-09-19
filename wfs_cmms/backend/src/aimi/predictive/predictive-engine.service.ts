/**
 * AIMI Predictive Engine
 * Master Blueprint V2 / AIMI-PREDICTIVE
 * Deterministic failure-risk forecast. No ML. No global instance.
 */

import type { Database } from "../../core/database/database.interface";
import { createPreparedStatement } from "../../core/database/prepared-statement";
import type { ContextDto } from "../../core/dto/context.dto";
import { createError } from "../../core/errors/error-factory";
import type { ErrorType } from "../../core/errors/error-types";
import type { EventBusService } from "../../core/event-bus/event-bus.service";
import type { IncomingEvent } from "../../core/event-bus/event.interface";
import type { LifecycleEngineService } from "../../core/lifecycle-engine/lifecycle-engine.service";
import type { LifecycleSnapshot } from "../../core/lifecycle-engine/lifecycle-snapshot";
import type { AuditLogHook, Logger } from "../../core/logger/logger.interface";
import { err } from "../../core/results/err";
import { ok } from "../../core/results/ok";
import type { Result } from "../../core/results/result.interface";
import type { ResultContext } from "../../core/results/result-context";
import type { RuleEngineService } from "../../core/rule-engine/rule-engine.service";
import { contextSchema, toRuleContext } from "../../core/validation/context.schema";
import type { RoutingOutput } from "../routing/routing-output.interface";
import type { SchedulingOutput } from "../scheduling/scheduling-output.interface";
import type { SeverityOutput } from "../severity/severity-output.interface";
import { evaluatePredictiveTree } from "./predictive-decision-tree";
import {
  incomingEventFromPredictiveEscalated,
  incomingEventFromPredictiveGenerated,
  incomingEventFromPredictiveUpdated,
} from "./predictive-events";
import type { FailureRisk, PredictiveInputs } from "./predictive-inputs.interface";
import { freezePredictiveOutput, type PredictiveOutput } from "./predictive-output.interface";
import {
  doesPredictiveOverrideReduceSafety,
  isHigherFailureRisk,
  isRoleAllowedToForecast,
  isRoleAllowedToOverridePredictive,
  scoreForFailureRisk,
} from "./predictive-rules";

export type PredictiveEngineServiceOptions = {
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

export class PredictiveEngineService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;
  private readonly eventBus: EventBusService;
  private readonly auditLogHook: AuditLogHook;
  private readonly ruleEngine: RuleEngineService;
  private readonly lifecycleEngine: LifecycleEngineService;

  constructor(options: PredictiveEngineServiceOptions) {
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

  async forecast(
    inputs: PredictiveInputs,
    severity: SeverityOutput | null,
    routing: RoutingOutput | null,
    scheduling: SchedulingOutput | null,
    previous: PredictiveOutput | null,
    contextInput: unknown,
    snapshot: LifecycleSnapshot | null,
  ): Promise<Result<PredictiveOutput>> {
    const parsed = contextSchema.safeParse(contextInput, this.tenant_id);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType =
        parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      const error = createError(error_type, {
        tenant_id: this.tenant_id,
        user_id: inputs.user_id,
        role: inputs.role,
        timestamp: inputs.timestamp,
        correlation_id: inputs.asset_id,
      });
      return err(error, {
        tenant_id: this.tenant_id,
        user_id: inputs.user_id,
        role: inputs.role,
        timestamp: inputs.timestamp,
        correlation_id: inputs.asset_id,
        rule_id: "",
        lifecycle_kind: "workorder",
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
      if (severity.inputs.workorder_id !== inputs.workorder_id) {
        const error = createError("dto invalid", {
          tenant_id: dto.tenant_id,
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
      if (routing.inputs.workorder_id !== inputs.workorder_id) {
        const error = createError("dto invalid", {
          tenant_id: dto.tenant_id,
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
      if (scheduling.scheduling_inputs.workorder_id !== inputs.workorder_id) {
        const error = createError("dto invalid", {
          tenant_id: dto.tenant_id,
          user_id: dto.user_id,
          role: dto.role,
          timestamp: dto.timestamp,
          correlation_id: dto.correlation_id,
        });
        return err(error, context);
      }
    }
    if (previous !== null) {
      if (previous.tenant_id !== this.tenant_id) {
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
    if (isRoleAllowedToForecast(dto.role) === false) {
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

    const match = evaluatePredictiveTree(inputs);
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

    const output = freezePredictiveOutput({
      predictive_score: scoreForFailureRisk(match.failure_risk),
      failure_risk: match.failure_risk,
      predictive_reason: match.reason,
      predictive_inputs: inputs,
      predictive_timestamp: dto.timestamp,
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
    });

    let incoming = incomingEventFromPredictiveGenerated(output);
    let action = "aimi.predictive.generated";
    if (previous !== null) {
      if (isHigherFailureRisk(output.failure_risk, previous.failure_risk) === true) {
        incoming = incomingEventFromPredictiveEscalated(output);
        action = "aimi.predictive.escalated";
      }
    }

    await this.persistAndEmit(output, incoming, action);

    if (snapshot !== null) {
      if (snapshot.kind === "pm") {
        if (snapshot.state === "PM_COMPLETED") {
          await this.lifecycleEngine.transition(snapshot, {
            tenant_id: dto.tenant_id,
            user_id: dto.user_id,
            role: dto.role,
            kind: "pm",
            entity_id: snapshot.entity_id,
            state: "PM_COMPLETED",
            timestamp: dto.timestamp,
          }, "PM_PREDICTIVE_UPDATE");
        }
      }
      if (snapshot.kind === "compliance") {
        if (snapshot.state === "COMPLIANCE_REPORTING") {
          await this.lifecycleEngine.transition(snapshot, {
            tenant_id: dto.tenant_id,
            user_id: dto.user_id,
            role: dto.role,
            kind: "compliance",
            entity_id: snapshot.entity_id,
            state: "COMPLIANCE_REPORTING",
            timestamp: dto.timestamp,
          }, "AIMI_PREDICTIVE_COMPLIANCE_UPDATES");
        }
      }
    }

    return ok(output, context);
  }

  async override(
    current: PredictiveOutput,
    override_risk: FailureRisk,
    override_reason: string,
    contextInput: unknown,
  ): Promise<Result<PredictiveOutput>> {
    const parsed = contextSchema.safeParse(contextInput, this.tenant_id);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType =
        parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      const error = createError(error_type, {
        tenant_id: this.tenant_id,
        user_id: current.user_id,
        role: current.role,
        timestamp: current.predictive_timestamp,
        correlation_id: current.predictive_inputs.asset_id,
      });
      return err(error, {
        tenant_id: this.tenant_id,
        user_id: current.user_id,
        role: current.role,
        timestamp: current.predictive_timestamp,
        correlation_id: current.predictive_inputs.asset_id,
        rule_id: "",
        lifecycle_kind: "workorder",
        from_state: "",
        to_state: "",
        entity_id: current.predictive_inputs.workorder_id,
      });
    }
    const dto = parsed.data;
    const context = resultContextFromDto(dto);
    if (isRoleAllowedToOverridePredictive(dto.role) === false) {
      const error = createError("role unauthorized", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }
    if (override_reason === "") {
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
    if (doesPredictiveOverrideReduceSafety(current.failure_risk, override_risk) === true) {
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }

    const output = freezePredictiveOutput({
      predictive_score: scoreForFailureRisk(override_risk),
      failure_risk: override_risk,
      predictive_reason: override_reason,
      predictive_inputs: current.predictive_inputs,
      predictive_timestamp: dto.timestamp,
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
    });
    await this.persistAndEmit(output, incomingEventFromPredictiveUpdated(output), "aimi.predictive.updated");
    return ok(output, context);
  }

  private async persistAndEmit(
    output: PredictiveOutput,
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
      correlation_id: output.predictive_inputs.asset_id,
      timestamp: output.predictive_timestamp,
    });
    const log_id = output.predictive_inputs.asset_id + ":" + output.failure_risk + ":" + output.predictive_timestamp;
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
          timestamp: output.predictive_timestamp,
          action,
          previous_value: "",
          new_value: output.failure_risk,
        }),
        output.predictive_timestamp,
      ],
    );
    await this.database.execute(statement);
    await this.eventBus.publish(incoming);
  }
}
