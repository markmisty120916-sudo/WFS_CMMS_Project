import type { PredictiveEngineService } from "../../aimi/predictive/predictive-engine.service";
import type { RoutingEngineService } from "../../aimi/routing/routing-engine.service";
import type { Database } from "../../core/database/database.interface";
import { createPreparedStatement } from "../../core/database/prepared-statement";
import type { DtoRole } from "../../core/dto/base.dto";
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
import { asRecord, asString } from "../../core/validation/dto.schema";
import { parseDtoRole } from "../../core/validation/role.schema";
import { PartsRequestAimiAdapter } from "./adapters/parts-request-aimi.adapter";
import { PartsRequestInventoryAdapter } from "./adapters/parts-request-inventory.adapter";
import { isPartsRequestApiAllowed } from "./api/parts-request.api.permissions";
import { PartsRequestApprovalEngine } from "./engines/parts-request-approval.engine";
import { PartsRequestAvailabilityEngine } from "./engines/parts-request-availability.engine";
import { PartsRequestPredictiveEngine } from "./engines/parts-request-predictive.engine";
import { PartsRequestRoutingEngine } from "./engines/parts-request-routing.engine";
import { PartsRequestUsageEngine } from "./engines/parts-request-usage.engine";
import {
  applyPartsRequestCreate,
  applyPartsRequestSoftDelete,
  parsePartsRequestApprove,
  parsePartsRequestCreate,
  parsePartsRequestDeny,
  parsePartsRequestListQuery,
  parsePartsRequestUpdate,
} from "./parts-request-builder";
import {
  incomingEventFromPartsRequestApproved,
  partsRequestAuditLogId,
  type PartsRequestAuditAction,
} from "./parts-request-events";
import {
  canPublishPartsRequestEvent,
  partsRequestCreateError,
  partsRequestImmutableError,
  partsRequestManageError,
  partsRequestReadError,
} from "./parts-request-rules";
import {
  freezePartsRequestActionResult,
  freezePartsRequestListResult,
  type PartsRequest,
  type PartsRequestActionResult,
  type PartsRequestListResult,
} from "./parts-request.interface";
import {
  filterRequestsByPart,
  filterRequestsByStatus,
  filterRequestsByWorkorder,
} from "./utils/parts-request-filters";

export type PartsRequestServiceOptions = {
  tenant_id: string;
  logger: Logger;
  database: Database;
  eventBus: EventBusService;
  auditLogHook: AuditLogHook;
  ruleEngine: RuleEngineService;
  lifecycleEngine: LifecycleEngineService;
  predictiveEngine: PredictiveEngineService;
  routingEngine: RoutingEngineService;
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

export class PartsRequestService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;
  private readonly eventBus: EventBusService;
  private readonly auditLogHook: AuditLogHook;
  private readonly ruleEngine: RuleEngineService;
  private readonly lifecycleEngine: LifecycleEngineService;
  private readonly approvalEngine: PartsRequestApprovalEngine;
  private readonly availabilityEngine: PartsRequestAvailabilityEngine;
  private readonly routingEngine: PartsRequestRoutingEngine;
  private readonly predictiveEngine: PartsRequestPredictiveEngine;
  private readonly usageEngine: PartsRequestUsageEngine;

  constructor(options: PartsRequestServiceOptions) {
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
    const inventoryAdapter = new PartsRequestInventoryAdapter(options.tenant_id, options.database);
    const aimiAdapter = new PartsRequestAimiAdapter(options.predictiveEngine, options.routingEngine);
    this.approvalEngine = new PartsRequestApprovalEngine(options.tenant_id, options.database);
    this.availabilityEngine = new PartsRequestAvailabilityEngine(inventoryAdapter);
    this.routingEngine = new PartsRequestRoutingEngine(aimiAdapter, inventoryAdapter);
    this.predictiveEngine = new PartsRequestPredictiveEngine(aimiAdapter, inventoryAdapter);
    this.usageEngine = new PartsRequestUsageEngine(options.tenant_id, options.database);
  }

  async listRequests(
    contextInput: unknown,
    workorder_id: string,
    queryInput: unknown,
  ): Promise<Result<PartsRequestListResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isPartsRequestApiAllowed("list_requests", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const readGate = partsRequestReadError(dto.role);
    if (readGate !== "none") {
      return this.fail(readGate, context);
    }
    const loaded = await this.approvalEngine.loadByWorkorder(workorder_id);
    if (loaded === null) {
      return this.fail("tenant_id mismatch", context);
    }
    const query = parsePartsRequestListQuery(queryInput);
    let requests = filterRequestsByWorkorder(loaded, workorder_id);
    requests = filterRequestsByPart(requests, query.part_id);
    requests = filterRequestsByStatus(requests, query.status);
    return ok(
      freezePartsRequestListResult({
        tenant_id: this.tenant_id,
        role: dto.role,
        requests,
      }),
      context,
    );
  }

  async getRequest(contextInput: unknown, request_id: string): Promise<Result<PartsRequest>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isPartsRequestApiAllowed("get_request", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const readGate = partsRequestReadError(dto.role);
    if (readGate !== "none") {
      return this.fail(readGate, context);
    }
    if (request_id === "") {
      return this.fail("entity_id required", context);
    }
    const request = await this.approvalEngine.load(request_id);
    if (request === null) {
      return this.fail("entity_id mismatch", context);
    }
    return ok(request, context);
  }

  async createRequest(
    contextInput: unknown,
    workorder_id: string,
    bodyInput: unknown,
  ): Promise<Result<PartsRequestActionResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isPartsRequestApiAllowed("create_request", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const createGate = partsRequestCreateError(dto.role);
    if (createGate !== "none") {
      return this.fail(createGate, context);
    }
    if (dto.entity_id === "") {
      return this.fail("entity_id required", context);
    }
    const parsed = parsePartsRequestCreate(bodyInput);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType = parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      return this.fail(error_type, context);
    }
    if (workorder_id !== "") {
      if (parsed.data.workorder_id !== workorder_id) {
        return this.fail("dto invalid", context);
      }
    }
    const built = applyPartsRequestCreate(this.tenant_id, dto.entity_id, dto.timestamp, parsed.data);
    if (built.success === false || built.value === null) {
      return this.fail(built.error_code, context);
    }
    await this.approvalEngine.insert(built.value);
    await this.audit(dto, built.value.request_id, "parts.request.created", built.value.status);
    return this.actionResult(dto, built.value, contextInput, context, null);
  }

  async updateRequest(
    contextInput: unknown,
    request_id: string,
    bodyInput: unknown,
  ): Promise<Result<PartsRequestActionResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isPartsRequestApiAllowed("update_request", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const manageGate = partsRequestManageError(dto.role);
    if (manageGate !== "none") {
      return this.fail(manageGate, context);
    }
    if (request_id === "") {
      return this.fail("entity_id required", context);
    }
    const current = await this.approvalEngine.load(request_id);
    if (current === null) {
      return this.fail("entity_id mismatch", context);
    }
    const immutable = partsRequestImmutableError(current.status);
    if (immutable !== "none") {
      return this.fail(immutable, context);
    }
    const parsed = parsePartsRequestUpdate(bodyInput);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType = parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      return this.fail(error_type, context);
    }
    const next = this.approvalEngine.applyUpdate(current, dto.timestamp, parsed.data);
    if (next === null) {
      return this.fail("lifecycle transition invalid", context);
    }
    await this.approvalEngine.update(next);
    await this.audit(dto, next.request_id, "parts.request.updated", next.status);
    return this.actionResult(dto, next, contextInput, context, null);
  }

  async approveRequest(
    contextInput: unknown,
    request_id: string,
    bodyInput: unknown,
  ): Promise<Result<PartsRequestActionResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isPartsRequestApiAllowed("approve_request", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const manageGate = partsRequestManageError(dto.role);
    if (manageGate !== "none") {
      return this.fail(manageGate, context);
    }
    if (request_id === "") {
      return this.fail("entity_id required", context);
    }
    const current = await this.approvalEngine.load(request_id);
    if (current === null) {
      return this.fail("entity_id mismatch", context);
    }
    const immutable = partsRequestImmutableError(current.status);
    if (immutable !== "none") {
      return this.fail(immutable, context);
    }
    const parsed = parsePartsRequestApprove(bodyInput);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType = parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      return this.fail(error_type, context);
    }
    const next = this.approvalEngine.applyApproved(current, dto.timestamp);
    if (next === null) {
      return this.fail("lifecycle transition invalid", context);
    }
    await this.approvalEngine.update(next);
    const availability = await this.availabilityEngine.check(next);
    let usage = null;
    if (availability.available === true) {
      usage = this.usageEngine.buildFromApproval(next, dto.timestamp);
      await this.usageEngine.insert(usage);
    }
    await this.audit(dto, next.request_id, "parts.request.approved", parsed.data.reason);
    if (canPublishPartsRequestEvent(dto.role) === true) {
      await this.eventBus.publish(incomingEventFromPartsRequestApproved(dto, next));
    }
    return this.actionResult(dto, next, contextInput, context, usage);
  }

  async denyRequest(
    contextInput: unknown,
    request_id: string,
    bodyInput: unknown,
  ): Promise<Result<PartsRequestActionResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isPartsRequestApiAllowed("deny_request", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const manageGate = partsRequestManageError(dto.role);
    if (manageGate !== "none") {
      return this.fail(manageGate, context);
    }
    if (request_id === "") {
      return this.fail("entity_id required", context);
    }
    const current = await this.approvalEngine.load(request_id);
    if (current === null) {
      return this.fail("entity_id mismatch", context);
    }
    const immutable = partsRequestImmutableError(current.status);
    if (immutable !== "none") {
      return this.fail(immutable, context);
    }
    const parsed = parsePartsRequestDeny(bodyInput);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType = parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      return this.fail(error_type, context);
    }
    const next = this.approvalEngine.applyDenied(current, dto.timestamp);
    if (next === null) {
      return this.fail("lifecycle transition invalid", context);
    }
    await this.approvalEngine.update(next);
    await this.audit(dto, next.request_id, "parts.request.denied", parsed.data.reason);
    return this.actionResult(dto, next, contextInput, context, null);
  }

  async deleteRequest(contextInput: unknown, request_id: string): Promise<Result<PartsRequest>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isPartsRequestApiAllowed("delete_request", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const manageGate = partsRequestManageError(dto.role);
    if (manageGate !== "none") {
      return this.fail(manageGate, context);
    }
    if (request_id === "") {
      return this.fail("entity_id required", context);
    }
    const current = await this.approvalEngine.load(request_id);
    if (current === null) {
      return this.fail("entity_id mismatch", context);
    }
    const built = applyPartsRequestSoftDelete(current, dto.timestamp);
    if (built.success === false || built.value === null) {
      return this.fail(built.error_code, context);
    }
    await this.approvalEngine.softDelete(built.value);
    await this.audit(dto, built.value.request_id, "parts.request.updated", "deleted");
    return ok(built.value, context);
  }

  private async actionResult(
    dto: ContextDto,
    request: PartsRequest,
    contextInput: unknown,
    context: ResultContext,
    usage: PartsRequestActionResult["usage"],
  ): Promise<Result<PartsRequestActionResult>> {
    const availability = await this.availabilityEngine.check(request);
    const predictive = await this.predictiveEngine.forecast(dto, request, contextInput);
    const routing = await this.routingEngine.recommend(dto, request, contextInput);
    return ok(
      freezePartsRequestActionResult({
        tenant_id: this.tenant_id,
        request,
        availability,
        usage,
        predictive,
        routing,
      }),
      context,
    );
  }

  private async open(contextInput: unknown): Promise<Result<ContextDto>> {
    const parsed = contextSchema.safeParse(contextInput, this.tenant_id);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType =
        parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      const identity = this.identityFromInput(contextInput);
      const context: ResultContext = {
        tenant_id: this.tenant_id,
        user_id: identity.user_id,
        role: identity.role,
        timestamp: identity.timestamp,
        correlation_id: identity.correlation_id,
        rule_id: "",
        lifecycle_kind: "",
        from_state: "",
        to_state: "",
        entity_id: identity.entity_id,
      };
      return this.fail(error_type, context);
    }
    const dto = parsed.data;
    const context = resultContextFromDto(dto);
    if (dto.user_id === "") {
      return this.fail("user_id required", context);
    }
    const rule = await this.ruleEngine.evaluate(toRuleContext(dto));
    if (rule.allowed === false) {
      const error_type: ErrorType =
        rule.error_code === "none" ? "role unauthorized" : rule.error_code;
      return this.fail(error_type, context);
    }
    return ok(dto, context);
  }

  private identityFromInput(input: unknown): {
    user_id: string;
    role: DtoRole;
    timestamp: string;
    correlation_id: string;
    entity_id: string;
  } {
    const record = asRecord(input);
    if (record === null) {
      throw new Error("dto invalid");
    }
    const user_id = asString(record.user_id);
    if (user_id === "") {
      throw new Error("user_id required");
    }
    const timestamp = asString(record.timestamp);
    if (timestamp === "") {
      throw new Error("timestamp required");
    }
    const role = parseDtoRole(record.role);
    if (role === null) {
      throw new Error("role invalid");
    }
    return {
      user_id,
      role,
      timestamp,
      correlation_id: asString(record.correlation_id),
      entity_id: asString(record.entity_id),
    };
  }

  private fail(error_type: ErrorType, context: ResultContext): Result<never> {
    const error = createError(error_type, {
      tenant_id: this.tenant_id,
      user_id: context.user_id,
      role: context.role,
      timestamp: context.timestamp,
      correlation_id: context.correlation_id,
    });
    return err(error, context);
  }

  private async audit(
    dto: ContextDto,
    entity_id: string,
    action: PartsRequestAuditAction,
    new_value: string,
  ): Promise<void> {
    this.logger.info(action);
    this.auditLogHook.write({
      level: "info",
      message: action,
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      correlation_id: entity_id,
      timestamp: dto.timestamp,
    });
    const log_id = partsRequestAuditLogId(entity_id, action, dto.timestamp);
    const statement = createPreparedStatement(
      "INSERT INTO IntegrationLogs (log_id, tenant_id, event_id, message, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $5, NULL)",
      [
        dto.tenant_id,
        log_id,
        log_id,
        JSON.stringify({
          tenant_id: dto.tenant_id,
          user_id: dto.user_id,
          role: dto.role,
          timestamp: dto.timestamp,
          action,
          previous_value: "",
          new_value,
        }),
        dto.timestamp,
      ],
    );
    await this.database.execute(statement);
  }
}
