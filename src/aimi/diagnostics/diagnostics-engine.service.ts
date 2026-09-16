/**
 * AIMI Diagnostics Engine
 * Master Blueprint V2 / AIMI-DIAGNOSTIC-FLOWS
 * Deterministic catalog path selection. No invented steps. No global instance.
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
import type { PredictiveOutput } from "../predictive/predictive-output.interface";
import type { RoutingOutput } from "../routing/routing-output.interface";
import type { SchedulingOutput } from "../scheduling/scheduling-output.interface";
import type { SeverityOutput } from "../severity/severity-output.interface";
import { evaluateDiagnosticsTree } from "./diagnostics-decision-tree";
import {
  incomingEventFromDiagnosticStepCompleted,
  incomingEventFromDiagnosticStepSkipped,
  incomingEventFromDiagnosticStepStarted,
  incomingEventFromDiagnosticVerification,
} from "./diagnostics-events";
import type { DiagnosticInputs } from "./diagnostics-inputs.interface";
import { freezeDiagnosticsOutput, type DiagnosticsOutput } from "./diagnostics-output.interface";
import {
  canSkipStep,
  findStep,
  isRoleAllowedToDiagnose,
  isStepRecorded,
  nextPendingStep,
  requiredStepsComplete,
} from "./diagnostics-rules";

export type DiagnosticsEngineServiceOptions = {
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

function appendId(ids: readonly string[], step_id: string): readonly string[] {
  const next: string[] = [];
  let index = 0;
  while (index < ids.length) {
    next.push(ids[index]);
    index = index + 1;
  }
  next.push(step_id);
  return next;
}

export class DiagnosticsEngineService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;
  private readonly eventBus: EventBusService;
  private readonly auditLogHook: AuditLogHook;
  private readonly ruleEngine: RuleEngineService;
  private readonly lifecycleEngine: LifecycleEngineService;

  constructor(options: DiagnosticsEngineServiceOptions) {
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

  async start(
    inputs: DiagnosticInputs,
    severity: SeverityOutput | null,
    routing: RoutingOutput | null,
    scheduling: SchedulingOutput | null,
    predictive: PredictiveOutput | null,
    contextInput: unknown,
    snapshot: LifecycleSnapshot | null,
  ): Promise<Result<DiagnosticsOutput>> {
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
      if (severity.severity !== inputs.severity) {
        const error = createError("dto invalid", {
          tenant_id: dto.tenant_id,
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
      if (routing.technician_id !== inputs.technician_id) {
        const error = createError("dto invalid", {
          tenant_id: dto.tenant_id,
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
      if (predictive.predictive_inputs.workorder_id !== inputs.workorder_id) {
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
    if (isRoleAllowedToDiagnose(dto.role) === false) {
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

    const match = evaluateDiagnosticsTree(inputs);
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

    const output = freezeDiagnosticsOutput({
      diagnostic_flow_id: match.diagnostic_flow_id,
      diagnostic_path: match.path,
      recommended_repair_id: match.repair_id,
      recommended_part_id: match.part_id,
      recommended_labor_id: match.labor_id,
      steps: match.steps,
      steps_taken: [],
      steps_skipped: [],
      current_step_id: match.steps[0].step_id,
      verification_complete: false,
      diagnostic_reason: match.reason,
      diagnostic_inputs: inputs,
      diagnostic_timestamp: dto.timestamp,
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
    });

    await this.persistAndEmit(output, incomingEventFromDiagnosticStepStarted(output), "diagnostic.step.started");

    if (snapshot === null) {
      const started = await this.lifecycleEngine.start({
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        kind: "diagnostic",
        entity_id: inputs.workorder_id,
        state: "SYMPTOM_INTAKE",
        timestamp: dto.timestamp,
      });
      await this.lifecycleEngine.transition(started, {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        kind: "diagnostic",
        entity_id: inputs.workorder_id,
        state: "SYMPTOM_INTAKE",
        timestamp: dto.timestamp,
      }, "FAULT_CORRELATION");
    }
    if (snapshot !== null) {
      if (snapshot.kind === "diagnostic") {
        if (snapshot.state === "SYMPTOM_INTAKE") {
          await this.lifecycleEngine.transition(snapshot, {
            tenant_id: dto.tenant_id,
            user_id: dto.user_id,
            role: dto.role,
            kind: "diagnostic",
            entity_id: snapshot.entity_id,
            state: "SYMPTOM_INTAKE",
            timestamp: dto.timestamp,
          }, "FAULT_CORRELATION");
        }
      }
    }

    return ok(output, context);
  }

  async completeStep(
    current: DiagnosticsOutput,
    step_id: string,
    contextInput: unknown,
    snapshot: LifecycleSnapshot | null,
  ): Promise<Result<DiagnosticsOutput>> {
    const parsed = this.parseOverrideContext(current, contextInput);
    if (parsed.ok === false) {
      return parsed.result;
    }
    const dto = parsed.dto;
    const context = parsed.context;
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
    if (current.current_step_id !== step_id) {
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }
    if (isStepRecorded(current.steps_taken, step_id) === true) {
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }

    const taken = appendId(current.steps_taken, step_id);
    const pending = nextPendingStep(current.steps, taken, current.steps_skipped);
    let current_step_id = "";
    if (pending !== null) {
      current_step_id = pending.step_id;
    }
    const output = freezeDiagnosticsOutput({
      diagnostic_flow_id: current.diagnostic_flow_id,
      diagnostic_path: current.diagnostic_path,
      recommended_repair_id: current.recommended_repair_id,
      recommended_part_id: current.recommended_part_id,
      recommended_labor_id: current.recommended_labor_id,
      steps: current.steps,
      steps_taken: taken,
      steps_skipped: current.steps_skipped,
      current_step_id,
      verification_complete: current.verification_complete,
      diagnostic_reason: current.diagnostic_reason,
      diagnostic_inputs: current.diagnostic_inputs,
      diagnostic_timestamp: dto.timestamp,
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
    });
    await this.persistAndEmit(output, incomingEventFromDiagnosticStepCompleted(output, step_id), "diagnostic.step.completed");
    if (snapshot !== null) {
      if (snapshot.kind === "diagnostic") {
        if (snapshot.state === "FAULT_CORRELATION") {
          await this.lifecycleEngine.transition(snapshot, {
            tenant_id: dto.tenant_id,
            user_id: dto.user_id,
            role: dto.role,
            kind: "diagnostic",
            entity_id: snapshot.entity_id,
            state: "FAULT_CORRELATION",
            timestamp: dto.timestamp,
          }, "DIAGNOSTIC_PATH_SELECTION");
        }
        if (snapshot.state === "DIAGNOSTIC_PATH_SELECTION") {
          await this.lifecycleEngine.transition(snapshot, {
            tenant_id: dto.tenant_id,
            user_id: dto.user_id,
            role: dto.role,
            kind: "diagnostic",
            entity_id: snapshot.entity_id,
            state: "DIAGNOSTIC_PATH_SELECTION",
            timestamp: dto.timestamp,
          }, "STEP_BY_STEP_TROUBLESHOOTING");
        }
      }
    }
    return ok(output, context);
  }

  async skipStep(
    current: DiagnosticsOutput,
    step_id: string,
    contextInput: unknown,
  ): Promise<Result<DiagnosticsOutput>> {
    const parsed = this.parseOverrideContext(current, contextInput);
    if (parsed.ok === false) {
      return parsed.result;
    }
    const dto = parsed.dto;
    const context = parsed.context;
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
    if (current.current_step_id !== step_id) {
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }
    const step = findStep(current.steps, step_id);
    if (step === null) {
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }
    if (canSkipStep(step) === false) {
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }

    const skipped = appendId(current.steps_skipped, step_id);
    const pending = nextPendingStep(current.steps, current.steps_taken, skipped);
    let current_step_id = "";
    if (pending !== null) {
      current_step_id = pending.step_id;
    }
    const output = freezeDiagnosticsOutput({
      diagnostic_flow_id: current.diagnostic_flow_id,
      diagnostic_path: current.diagnostic_path,
      recommended_repair_id: current.recommended_repair_id,
      recommended_part_id: current.recommended_part_id,
      recommended_labor_id: current.recommended_labor_id,
      steps: current.steps,
      steps_taken: current.steps_taken,
      steps_skipped: skipped,
      current_step_id,
      verification_complete: current.verification_complete,
      diagnostic_reason: current.diagnostic_reason,
      diagnostic_inputs: current.diagnostic_inputs,
      diagnostic_timestamp: dto.timestamp,
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
    });
    await this.persistAndEmit(output, incomingEventFromDiagnosticStepSkipped(output, step_id), "diagnostic.step.skipped");
    return ok(output, context);
  }

  async verify(
    current: DiagnosticsOutput,
    contextInput: unknown,
    snapshot: LifecycleSnapshot | null,
  ): Promise<Result<DiagnosticsOutput>> {
    const parsed = this.parseOverrideContext(current, contextInput);
    if (parsed.ok === false) {
      return parsed.result;
    }
    const dto = parsed.dto;
    const context = parsed.context;
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
    if (requiredStepsComplete(current.steps, current.steps_taken) === false) {
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }

    const output = freezeDiagnosticsOutput({
      diagnostic_flow_id: current.diagnostic_flow_id,
      diagnostic_path: current.diagnostic_path,
      recommended_repair_id: current.recommended_repair_id,
      recommended_part_id: current.recommended_part_id,
      recommended_labor_id: current.recommended_labor_id,
      steps: current.steps,
      steps_taken: current.steps_taken,
      steps_skipped: current.steps_skipped,
      current_step_id: current.current_step_id,
      verification_complete: true,
      diagnostic_reason: current.diagnostic_reason,
      diagnostic_inputs: current.diagnostic_inputs,
      diagnostic_timestamp: dto.timestamp,
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
    });
    await this.persistAndEmit(output, incomingEventFromDiagnosticVerification(output), "diagnostic.verification.completed");
    if (snapshot !== null) {
      if (snapshot.kind === "diagnostic") {
        if (snapshot.state === "VERIFICATION_STEPS") {
          await this.lifecycleEngine.transition(snapshot, {
            tenant_id: dto.tenant_id,
            user_id: dto.user_id,
            role: dto.role,
            kind: "diagnostic",
            entity_id: snapshot.entity_id,
            state: "VERIFICATION_STEPS",
            timestamp: dto.timestamp,
          }, "CLOSEOUT_CHECKLIST");
        }
      }
    }
    return ok(output, context);
  }

  private parseOverrideContext(
    current: DiagnosticsOutput,
    contextInput: unknown,
  ):
    | { ok: true; dto: ContextDto; context: ResultContext }
    | { ok: false; result: Result<DiagnosticsOutput> } {
    const parsed = contextSchema.safeParse(contextInput, this.tenant_id);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType =
        parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      const error = createError(error_type, {
        tenant_id: this.tenant_id,
        user_id: current.user_id,
        role: current.role,
        timestamp: current.diagnostic_timestamp,
        correlation_id: current.diagnostic_inputs.workorder_id,
      });
      return {
        ok: false,
        result: err(error, {
          tenant_id: this.tenant_id,
          user_id: current.user_id,
          role: current.role,
          timestamp: current.diagnostic_timestamp,
          correlation_id: current.diagnostic_inputs.workorder_id,
          rule_id: "",
          lifecycle_kind: "diagnostic",
          from_state: "",
          to_state: "",
          entity_id: current.diagnostic_inputs.workorder_id,
        }),
      };
    }
    const dto = parsed.data;
    if (isRoleAllowedToDiagnose(dto.role) === false) {
      const error = createError("role unauthorized", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return {
        ok: false,
        result: err(error, resultContextFromDto(dto)),
      };
    }
    return { ok: true, dto, context: resultContextFromDto(dto) };
  }

  private async persistAndEmit(
    output: DiagnosticsOutput,
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
      correlation_id: output.diagnostic_inputs.workorder_id,
      timestamp: output.diagnostic_timestamp,
    });
    const log_id = output.diagnostic_flow_id + ":" + output.current_step_id + ":" + output.diagnostic_timestamp;
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
          timestamp: output.diagnostic_timestamp,
          action,
          previous_value: "",
          new_value: output.diagnostic_path,
        }),
        output.diagnostic_timestamp,
      ],
    );
    await this.database.execute(statement);
    await this.eventBus.publish(incoming);
  }
}
