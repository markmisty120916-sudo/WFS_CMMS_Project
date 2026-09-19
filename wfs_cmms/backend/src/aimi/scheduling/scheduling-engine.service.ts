/**
 * AIMI Scheduling Engine
 * Master Blueprint V2 / AIMI-SCHEDULING
 * Deterministic window assignment. No guessing. No global instance.
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
import type { RoutingOutput } from "../routing/routing-output.interface";
import type { SeverityOutput } from "../severity/severity-output.interface";
import { evaluateSchedulingTree } from "./scheduling-decision-tree";
import {
  incomingEventFromScheduling,
  incomingEventFromSchedulingOverride,
} from "./scheduling-events";
import type {
  SchedulingBay,
  SchedulingInputs,
  SchedulingTechnician,
} from "./scheduling-inputs.interface";
import { freezeSchedulingOutput, type SchedulingOutput } from "./scheduling-output.interface";
import {
  doesSchedulingOverrideReduceSafety,
  findWindowSlotByBounds,
  isRoleAllowedToOverrideScheduling,
  isRoleAllowedToSchedule,
} from "./scheduling-rules";

export type SchedulingEngineServiceOptions = {
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

function findTechnician(
  technicians: readonly SchedulingTechnician[],
  technician_id: string,
): SchedulingTechnician | null {
  let index = 0;
  while (index < technicians.length) {
    if (technicians[index].technician_id === technician_id) {
      return technicians[index];
    }
    index = index + 1;
  }
  return null;
}

function findBay(bays: readonly SchedulingBay[], bay_id: string): SchedulingBay | null {
  let index = 0;
  while (index < bays.length) {
    if (bays[index].bay_id === bay_id) {
      return bays[index];
    }
    index = index + 1;
  }
  return null;
}

export class SchedulingEngineService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;
  private readonly eventBus: EventBusService;
  private readonly auditLogHook: AuditLogHook;
  private readonly ruleEngine: RuleEngineService;
  private readonly lifecycleEngine: LifecycleEngineService;

  constructor(options: SchedulingEngineServiceOptions) {
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

  async assign(
    inputs: SchedulingInputs,
    severity: SeverityOutput,
    routing: RoutingOutput,
    contextInput: unknown,
    snapshot: LifecycleSnapshot | null,
  ): Promise<Result<SchedulingOutput>> {
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
    if (routing.technician_id !== inputs.routed_technician_id) {
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }
    if (routing.bay_id !== inputs.routed_bay_id) {
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }
    if (isRoleAllowedToSchedule(dto.role) === false) {
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

    const match = evaluateSchedulingTree(inputs);
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

    const output = freezeSchedulingOutput({
      scheduled_start: match.scheduled_start,
      scheduled_end: match.scheduled_end,
      technician_id: match.technician_id,
      bay_id: match.bay_id,
      scheduling_reason: match.reason,
      scheduling_inputs: inputs,
      scheduling_timestamp: dto.timestamp,
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
    });

    await this.persistAndEmit(output, incomingEventFromScheduling(output), "aimi.scheduling.assigned");

    if (snapshot !== null) {
      if (snapshot.state === "ROUTED") {
        await this.lifecycleEngine.transition(snapshot, {
          tenant_id: dto.tenant_id,
          user_id: dto.user_id,
          role: dto.role,
          kind: "workorder",
          entity_id: inputs.workorder_id,
          state: "ROUTED",
          timestamp: dto.timestamp,
        }, "SCHEDULED");
      }
    }

    return ok(output, context);
  }

  async override(
    current: SchedulingOutput,
    scheduled_start: string,
    scheduled_end: string,
    technician_id: string,
    bay_id: string,
    override_reason: string,
    contextInput: unknown,
  ): Promise<Result<SchedulingOutput>> {
    const parsed = contextSchema.safeParse(contextInput, this.tenant_id);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType =
        parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      const error = createError(error_type, {
        tenant_id: this.tenant_id,
        user_id: current.user_id,
        role: current.role,
        timestamp: current.scheduling_timestamp,
        correlation_id: current.scheduling_inputs.workorder_id,
      });
      return err(error, {
        tenant_id: this.tenant_id,
        user_id: current.user_id,
        role: current.role,
        timestamp: current.scheduling_timestamp,
        correlation_id: current.scheduling_inputs.workorder_id,
        rule_id: "",
        lifecycle_kind: "workorder",
        from_state: "",
        to_state: "",
        entity_id: current.scheduling_inputs.workorder_id,
      });
    }
    const dto = parsed.data;
    const context = resultContextFromDto(dto);
    if (isRoleAllowedToOverrideScheduling(dto.role) === false) {
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

    const required = evaluateSchedulingTree(current.scheduling_inputs);
    if (required === null) {
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }

    const slot = findWindowSlotByBounds(
      current.scheduling_inputs.windows,
      this.tenant_id,
      scheduled_start,
      scheduled_end,
    );
    const technician = findTechnician(current.scheduling_inputs.technicians, technician_id);
    const bay = findBay(current.scheduling_inputs.bays, bay_id);
    if (slot === null || technician === null || bay === null) {
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }
    if (doesSchedulingOverrideReduceSafety(
      current.scheduling_inputs,
      required.window,
      slot,
      technician,
      bay,
    ) === true) {
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }

    const output = freezeSchedulingOutput({
      scheduled_start,
      scheduled_end,
      technician_id,
      bay_id,
      scheduling_reason: override_reason,
      scheduling_inputs: current.scheduling_inputs,
      scheduling_timestamp: dto.timestamp,
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
    });
    await this.persistAndEmit(output, incomingEventFromSchedulingOverride(output), "workorder.scheduled");
    return ok(output, context);
  }

  private async persistAndEmit(
    output: SchedulingOutput,
    incoming: ReturnType<typeof incomingEventFromScheduling>,
    action: string,
  ): Promise<void> {
    this.logger.info(action);
    this.auditLogHook.write({
      level: "info",
      message: action,
      tenant_id: output.tenant_id,
      user_id: output.user_id,
      role: output.role,
      correlation_id: output.scheduling_inputs.workorder_id,
      timestamp: output.scheduling_timestamp,
    });
    const log_id = output.scheduling_inputs.workorder_id + ":" + output.scheduled_start + ":" + output.scheduling_timestamp;
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
          timestamp: output.scheduling_timestamp,
          action,
          previous_value: "",
          new_value: output.scheduled_start,
        }),
        output.scheduling_timestamp,
      ],
    );
    await this.database.execute(statement);
    await this.eventBus.publish(incoming);
  }
}
