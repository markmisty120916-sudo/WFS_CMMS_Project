/**
 * AIMI Severity Engine
 * Master Blueprint V2 / AIMI-SEVERITY
 * Deterministic S1–S5 classification. No guessing. No global engine instance.
 */

import type { Database } from "../../core/database/database.interface";
import { createPreparedStatement } from "../../core/database/prepared-statement";
import type { ContextDto } from "../../core/dto/context.dto";
import { createError } from "../../core/errors/error-factory";
import type { ErrorType } from "../../core/errors/error-types";
import type { EventBusService } from "../../core/event-bus/event-bus.service";
import type { LifecycleEngineService } from "../../core/lifecycle-engine/lifecycle-engine.service";
import type { LifecycleSnapshot } from "../../core/lifecycle-engine/lifecycle-snapshot";
import type { AuditLogHook, Logger } from "../../core/logger/logger.interface";
import { err } from "../../core/results/err";
import { ok } from "../../core/results/ok";
import type { Result } from "../../core/results/result.interface";
import type { ResultContext } from "../../core/results/result-context";
import type { RuleEngineService } from "../../core/rule-engine/rule-engine.service";
import { contextSchema, toRuleContext } from "../../core/validation/context.schema";
import { evaluateSeverityTree } from "./severity-decision-tree";
import { incomingEventFromSeverity } from "./severity-events";
import type { SeverityInputs } from "./severity-inputs.interface";
import { freezeSeverityOutput, type SeverityOutput } from "./severity-output.interface";
import type { SeverityLevel } from "./severity-levels";
import {
  doesOverrideReduceSafety,
  isRoleAllowedToClassify,
  isRoleAllowedToOverride,
} from "./severity-rules";

export type SeverityEngineServiceOptions = {
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

export class SeverityEngineService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;
  private readonly eventBus: EventBusService;
  private readonly auditLogHook: AuditLogHook;
  private readonly ruleEngine: RuleEngineService;
  private readonly lifecycleEngine: LifecycleEngineService;

  constructor(options: SeverityEngineServiceOptions) {
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

  async classify(
    inputs: SeverityInputs,
    contextInput: unknown,
    snapshot: LifecycleSnapshot | null,
  ): Promise<Result<SeverityOutput>> {
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
    if (isRoleAllowedToClassify(dto.role) === false) {
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

    const match = evaluateSeverityTree(inputs);
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

    const output = freezeSeverityOutput({
      severity: match.level,
      reason: match.reason,
      inputs,
      timestamp: dto.timestamp,
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
    });

    await this.persistAndEmit(output, "aimi.severity.assigned");

    if (snapshot !== null) {
      if (snapshot.state === "CREATED") {
        await this.lifecycleEngine.transition(snapshot, {
          tenant_id: dto.tenant_id,
          user_id: dto.user_id,
          role: dto.role,
          kind: "workorder",
          entity_id: inputs.workorder_id,
          state: "CREATED",
          timestamp: dto.timestamp,
        }, "AIMI_SEVERITY_ASSIGNED");
      }
    }

    return ok(output, context);
  }

  async override(
    current: SeverityOutput,
    override_level: SeverityLevel,
    override_reason: string,
    contextInput: unknown,
  ): Promise<Result<SeverityOutput>> {
    const parsed = contextSchema.safeParse(contextInput, this.tenant_id);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType =
        parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      const error = createError(error_type, {
        tenant_id: this.tenant_id,
        user_id: current.user_id,
        role: current.role,
        timestamp: current.timestamp,
        correlation_id: current.inputs.workorder_id,
      });
      return err(error, {
        tenant_id: this.tenant_id,
        user_id: current.user_id,
        role: current.role,
        timestamp: current.timestamp,
        correlation_id: current.inputs.workorder_id,
        rule_id: "",
        lifecycle_kind: "workorder",
        from_state: "",
        to_state: "",
        entity_id: current.inputs.workorder_id,
      });
    }
    const dto = parsed.data;
    const context = resultContextFromDto(dto);
    if (isRoleAllowedToOverride(dto.role) === false) {
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
    if (doesOverrideReduceSafety(current.severity, override_level) === true) {
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

    const output = freezeSeverityOutput({
      severity: override_level,
      reason: override_reason,
      inputs: current.inputs,
      timestamp: dto.timestamp,
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
    });
    await this.persistAndEmit(output, "workorder.severity.updated");
    return ok(output, context);
  }

  private async persistAndEmit(output: SeverityOutput, action: string): Promise<void> {
    this.logger.info(action);
    this.auditLogHook.write({
      level: "info",
      message: action,
      tenant_id: output.tenant_id,
      user_id: output.user_id,
      role: output.role,
      correlation_id: output.inputs.workorder_id,
      timestamp: output.timestamp,
    });
    const log_id = output.inputs.workorder_id + ":" + output.severity + ":" + output.timestamp;
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
          new_value: output.severity,
        }),
        output.timestamp,
      ],
    );
    await this.database.execute(statement);
    await this.eventBus.publish(incomingEventFromSeverity(output));
  }
}
