/**
 * AIMI Routing Engine
 * Master Blueprint V2 / AIMI-ROUTING
 * Deterministic technician and bay assignment. No guessing. No global instance.
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
import type { SeverityOutput } from "../severity/severity-output.interface";
import { evaluateRoutingTree } from "./routing-decision-tree";
import {
  incomingEventFromRouting,
  incomingEventFromRoutingOverride,
} from "./routing-events";
import type { BayCandidate, RoutingInputs, TechnicianCandidate } from "./routing-inputs.interface";
import { freezeRoutingOutput, type RoutingOutput } from "./routing-output.interface";
import {
  doesRoutingOverrideReduceSafety,
  isRoleAllowedToOverrideRouting,
  isRoleAllowedToRoute,
} from "./routing-rules";

export type RoutingEngineServiceOptions = {
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
  technicians: readonly TechnicianCandidate[],
  technician_id: string,
): TechnicianCandidate | null {
  let index = 0;
  while (index < technicians.length) {
    if (technicians[index].technician_id === technician_id) {
      return technicians[index];
    }
    index = index + 1;
  }
  return null;
}

function findBay(bays: readonly BayCandidate[], bay_id: string): BayCandidate | null {
  let index = 0;
  while (index < bays.length) {
    if (bays[index].bay_id === bay_id) {
      return bays[index];
    }
    index = index + 1;
  }
  return null;
}

export class RoutingEngineService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;
  private readonly eventBus: EventBusService;
  private readonly auditLogHook: AuditLogHook;
  private readonly ruleEngine: RuleEngineService;
  private readonly lifecycleEngine: LifecycleEngineService;

  constructor(options: RoutingEngineServiceOptions) {
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
    inputs: RoutingInputs,
    severity: SeverityOutput,
    contextInput: unknown,
    snapshot: LifecycleSnapshot | null,
  ): Promise<Result<RoutingOutput>> {
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
    if (isRoleAllowedToRoute(dto.role) === false) {
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

    const match = evaluateRoutingTree(inputs);
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

    const output = freezeRoutingOutput({
      technician_id: match.technician_id,
      bay_id: match.bay_id,
      routing_reason: match.reason,
      inputs,
      routing_timestamp: dto.timestamp,
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
    });

    await this.persistAndEmit(output, incomingEventFromRouting(output), "aimi.routing.assigned");

    if (snapshot !== null) {
      if (snapshot.state === "AIMI_SEVERITY_ASSIGNED") {
        await this.lifecycleEngine.transition(snapshot, {
          tenant_id: dto.tenant_id,
          user_id: dto.user_id,
          role: dto.role,
          kind: "workorder",
          entity_id: inputs.workorder_id,
          state: "AIMI_SEVERITY_ASSIGNED",
          timestamp: dto.timestamp,
        }, "ROUTED");
      }
    }

    return ok(output, context);
  }

  async override(
    current: RoutingOutput,
    technician_id: string,
    bay_id: string,
    override_reason: string,
    contextInput: unknown,
  ): Promise<Result<RoutingOutput>> {
    const parsed = contextSchema.safeParse(contextInput, this.tenant_id);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType =
        parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      const error = createError(error_type, {
        tenant_id: this.tenant_id,
        user_id: current.user_id,
        role: current.role,
        timestamp: current.routing_timestamp,
        correlation_id: current.inputs.workorder_id,
      });
      return err(error, {
        tenant_id: this.tenant_id,
        user_id: current.user_id,
        role: current.role,
        timestamp: current.routing_timestamp,
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
    if (isRoleAllowedToOverrideRouting(dto.role) === false) {
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
    const technician = findTechnician(current.inputs.technicians, technician_id);
    const bay = findBay(current.inputs.bays, bay_id);
    if (technician === null || bay === null) {
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }
    if (doesRoutingOverrideReduceSafety(current.inputs, technician, bay) === true) {
      const error = createError("dto invalid", {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        timestamp: dto.timestamp,
        correlation_id: dto.correlation_id,
      });
      return err(error, context);
    }

    const output = freezeRoutingOutput({
      technician_id,
      bay_id,
      routing_reason: override_reason,
      inputs: current.inputs,
      routing_timestamp: dto.timestamp,
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
    });
    await this.persistAndEmit(output, incomingEventFromRoutingOverride(output), "workorder.routing.updated");
    return ok(output, context);
  }

  private async persistAndEmit(
    output: RoutingOutput,
    incoming: ReturnType<typeof incomingEventFromRouting>,
    action: string,
  ): Promise<void> {
    this.logger.info(action);
    this.auditLogHook.write({
      level: "info",
      message: action,
      tenant_id: output.tenant_id,
      user_id: output.user_id,
      role: output.role,
      correlation_id: output.inputs.workorder_id,
      timestamp: output.routing_timestamp,
    });
    const log_id = output.inputs.workorder_id + ":" + output.technician_id + ":" + output.routing_timestamp;
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
          timestamp: output.routing_timestamp,
          action,
          previous_value: "",
          new_value: output.technician_id,
        }),
        output.routing_timestamp,
      ],
    );
    await this.database.execute(statement);
    await this.eventBus.publish(incoming);
  }
}
