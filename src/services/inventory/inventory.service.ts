import type { PredictiveEngineService } from "../../aimi/predictive/predictive-engine.service";
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
import { InventoryAimiAdapter } from "./adapters/inventory-aimi.adapter";
import { InventoryVendorAdapter } from "./adapters/inventory-vendor.adapter";
import { isInventoryApiAllowed } from "./api/inventory.api.permissions";
import { InventoryLevelsEngine } from "./engines/inventory-levels.engine";
import { InventoryPredictiveEngine } from "./engines/inventory-predictive.engine";
import { InventoryReorderEngine } from "./engines/inventory-reorder.engine";
import { InventoryStockEngine } from "./engines/inventory-stock.engine";
import { InventoryUsageEngine } from "./engines/inventory-usage.engine";
import { InventoryVendorEngine } from "./engines/inventory-vendor.engine";
import {
  applyPartWrite,
  buildPartForSoftDelete,
  parsePartCreate,
  parsePartListQuery,
  parsePartReorder,
  parsePartUpdate,
  parseStockAdjust,
  parseStockLevelQuery,
  parseVendorWrite,
} from "./inventory-builder";
import {
  incomingEventFromVendorOrder,
  inventoryAuditLogId,
  type InventoryAuditAction,
} from "./inventory-events";
import {
  canPublishInventoryEvent,
  inventoryReadError,
  inventoryWriteError,
} from "./inventory-rules";
import {
  freezePartListResult,
  freezeReorderResult,
  freezeStockAdjustResult,
  type Part,
  type PartListResult,
  type PartRequest,
  type ReorderResult,
  type StockAdjustResult,
  type StockLevel,
  type Vendor,
} from "./inventory.interface";
import { filterPartsByLocation } from "./utils/inventory-filters";

export type InventoryServiceOptions = {
  tenant_id: string;
  logger: Logger;
  database: Database;
  eventBus: EventBusService;
  auditLogHook: AuditLogHook;
  ruleEngine: RuleEngineService;
  lifecycleEngine: LifecycleEngineService;
  predictiveEngine: PredictiveEngineService;
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

export class InventoryService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;
  private readonly eventBus: EventBusService;
  private readonly auditLogHook: AuditLogHook;
  private readonly ruleEngine: RuleEngineService;
  private readonly lifecycleEngine: LifecycleEngineService;
  private readonly stockEngine: InventoryStockEngine;
  private readonly levelsEngine: InventoryLevelsEngine;
  private readonly reorderEngine: InventoryReorderEngine;
  private readonly usageEngine: InventoryUsageEngine;
  private readonly predictiveEngine: InventoryPredictiveEngine;
  private readonly vendorEngine: InventoryVendorEngine;

  constructor(options: InventoryServiceOptions) {
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
    this.stockEngine = new InventoryStockEngine(options.tenant_id, options.database);
    this.levelsEngine = new InventoryLevelsEngine();
    this.reorderEngine = new InventoryReorderEngine(options.tenant_id, options.database);
    this.usageEngine = new InventoryUsageEngine(options.tenant_id, options.database);
    const aimiAdapter = new InventoryAimiAdapter(options.predictiveEngine);
    this.predictiveEngine = new InventoryPredictiveEngine(aimiAdapter);
    this.vendorEngine = new InventoryVendorEngine(new InventoryVendorAdapter());
  }

  async listParts(contextInput: unknown, queryInput: unknown): Promise<Result<PartListResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isInventoryApiAllowed("list_parts", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const readGate = inventoryReadError(dto.role);
    if (readGate !== "none") {
      return this.fail(readGate, context);
    }
    const loaded = await this.stockEngine.loadList();
    if (loaded === null) {
      return this.fail("tenant_id mismatch", context);
    }
    const query = parsePartListQuery(queryInput);
    return ok(
      freezePartListResult({
        tenant_id: this.tenant_id,
        role: dto.role,
        parts: filterPartsByLocation(loaded, query.location),
      }),
      context,
    );
  }

  async getPart(contextInput: unknown, part_id: string): Promise<Result<Part>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isInventoryApiAllowed("get_part", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const readGate = inventoryReadError(dto.role);
    if (readGate !== "none") {
      return this.fail(readGate, context);
    }
    if (part_id === "") {
      return this.fail("entity_id required", context);
    }
    const part = await this.stockEngine.load(part_id);
    if (part === null) {
      return this.fail("entity_id mismatch", context);
    }
    return ok(part, context);
  }

  async createPart(contextInput: unknown, bodyInput: unknown): Promise<Result<Part>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isInventoryApiAllowed("create_part", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const writeGate = inventoryWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    if (dto.entity_id === "") {
      return this.fail("entity_id required", context);
    }
    const parsed = parsePartCreate(bodyInput);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType = parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      return this.fail(error_type, context);
    }
    const built = applyPartWrite(this.tenant_id, dto.entity_id, dto.timestamp, parsed.data, null);
    if (built.success === false || built.value === null) {
      return this.fail(built.error_code, context);
    }
    await this.stockEngine.insert(built.value);
    await this.audit(dto, built.value.part_id, "inventory.part.created", "created");
    return ok(built.value, context);
  }

  async updatePart(
    contextInput: unknown,
    part_id: string,
    bodyInput: unknown,
  ): Promise<Result<Part>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isInventoryApiAllowed("update_part", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const writeGate = inventoryWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    if (part_id === "") {
      return this.fail("entity_id required", context);
    }
    const current = await this.stockEngine.load(part_id);
    if (current === null) {
      return this.fail("entity_id mismatch", context);
    }
    const parsed = parsePartUpdate(bodyInput);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType = parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      return this.fail(error_type, context);
    }
    const built = applyPartWrite(this.tenant_id, part_id, dto.timestamp, parsed.data, current);
    if (built.success === false || built.value === null) {
      return this.fail(built.error_code, context);
    }
    await this.stockEngine.update(built.value);
    await this.audit(dto, built.value.part_id, "inventory.part.updated", "updated");
    return ok(built.value, context);
  }

  async deletePart(contextInput: unknown, part_id: string): Promise<Result<Part>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isInventoryApiAllowed("delete_part", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const writeGate = inventoryWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    if (part_id === "") {
      return this.fail("entity_id required", context);
    }
    const current = await this.stockEngine.load(part_id);
    if (current === null) {
      return this.fail("entity_id mismatch", context);
    }
    const built = buildPartForSoftDelete(current, dto.timestamp);
    if (built.success === false || built.value === null) {
      return this.fail(built.error_code, context);
    }
    await this.stockEngine.softDelete(built.value);
    await this.audit(dto, built.value.part_id, "inventory.part.deleted", "deleted");
    return ok(built.value, context);
  }

  async getInventory(
    contextInput: unknown,
    part_id: string,
    queryInput: unknown,
  ): Promise<Result<StockLevel>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isInventoryApiAllowed("get_inventory", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const readGate = inventoryReadError(dto.role);
    if (readGate !== "none") {
      return this.fail(readGate, context);
    }
    if (part_id === "") {
      return this.fail("entity_id required", context);
    }
    const part = await this.stockEngine.load(part_id);
    if (part === null) {
      return this.fail("entity_id mismatch", context);
    }
    const query = parseStockLevelQuery(queryInput);
    return ok(this.levelsEngine.build(part, query.reorder_point), context);
  }

  async adjustStock(
    contextInput: unknown,
    part_id: string,
    bodyInput: unknown,
  ): Promise<Result<StockAdjustResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isInventoryApiAllowed("adjust_stock", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const writeGate = inventoryWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    if (part_id === "") {
      return this.fail("entity_id required", context);
    }
    const current = await this.stockEngine.load(part_id);
    if (current === null) {
      return this.fail("entity_id mismatch", context);
    }
    const parsed = parseStockAdjust(bodyInput);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType = parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      return this.fail(error_type, context);
    }
    const applied = this.stockEngine.applyAdjustment(
      current,
      dto.timestamp,
      parsed.data.delta,
      parsed.data.reason,
    );
    if (applied === null) {
      return this.fail("dto invalid", context);
    }
    await this.stockEngine.update(applied.part);
    const consumed = this.usageEngine.consumedQuantity(applied.adjustment);
    const usage = this.usageEngine.buildUsage(
      this.tenant_id,
      part_id + ":usage:" + dto.timestamp,
      dto.timestamp,
      applied.part,
      parsed.data.workorder_id,
      consumed,
    );
    if (usage !== null) {
      await this.usageEngine.insertUsage(usage);
      const usageRequest = this.usageEngine.buildUsageRequest(
        this.tenant_id,
        part_id + ":usage-request:" + dto.timestamp,
        dto.timestamp,
        applied.part,
        parsed.data.workorder_id,
        consumed,
      );
      if (usageRequest !== null) {
        await this.usageEngine.insertUsageRequest(usageRequest);
      }
    }
    const predictive = await this.predictiveEngine.updateFromAdjustment(
      dto,
      applied.part,
      applied.adjustment,
      parsed.data.workorder_id,
      contextInput,
    );
    await this.audit(dto, applied.part.part_id, "inventory.stock.adjusted", applied.adjustment.new_quantity);
    return ok(
      freezeStockAdjustResult({
        tenant_id: this.tenant_id,
        part: applied.part,
        adjustment: applied.adjustment,
        predictive,
      }),
      context,
    );
  }

  async reorderPart(contextInput: unknown, bodyInput: unknown): Promise<Result<ReorderResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isInventoryApiAllowed("reorder_part", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const writeGate = inventoryWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    const parsed = parsePartReorder(bodyInput);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType = parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      return this.fail(error_type, context);
    }
    const part = await this.stockEngine.load(parsed.data.part_id);
    if (part === null) {
      return this.fail("entity_id mismatch", context);
    }
    let request_id = dto.entity_id;
    if (request_id === "") {
      request_id = parsed.data.part_id + ":reorder:" + dto.timestamp;
    }
    const built = this.reorderEngine.build(this.tenant_id, request_id, dto.timestamp, part, parsed.data);
    await this.reorderEngine.insert(built.request);
    if (parsed.data.vendor_name !== "") {
      this.vendorEngine.apply(this.tenant_id, {
        vendor_name: parsed.data.vendor_name,
        location: part.location,
      });
    }
    const predictive = await this.predictiveEngine.updateFromUsage(
      dto,
      part,
      parsed.data.workorder_id,
      contextInput,
    );
    await this.audit(dto, built.request.request_id, "inventory.reorder.created", built.reorder.quantity);
    if (canPublishInventoryEvent(dto.role) === true) {
      await this.eventBus.publish(incomingEventFromVendorOrder(dto, part, built.reorder));
    }
    return ok(
      freezeReorderResult({
        tenant_id: this.tenant_id,
        part,
        reorder: built.reorder,
        request: built.request,
        predictive,
      }),
      context,
    );
  }

  async upsertVendor(contextInput: unknown, bodyInput: unknown): Promise<Result<Vendor>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isInventoryApiAllowed("upsert_vendor", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const writeGate = inventoryWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    const parsed = parseVendorWrite(bodyInput);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType = parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      return this.fail(error_type, context);
    }
    const vendor = this.vendorEngine.apply(this.tenant_id, parsed.data);
    await this.audit(dto, vendor.vendor_name, "inventory.part.updated", vendor.location);
    return ok(vendor, context);
  }

  async listRequests(contextInput: unknown, workorder_id: string): Promise<Result<readonly PartRequest[]>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isInventoryApiAllowed("list_requests", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const readGate = inventoryReadError(dto.role);
    if (readGate !== "none") {
      return this.fail(readGate, context);
    }
    if (workorder_id === "") {
      return this.fail("entity_id required", context);
    }
    const requests = await this.reorderEngine.loadByWorkorder(workorder_id);
    if (requests === null) {
      return this.fail("tenant_id mismatch", context);
    }
    return ok(requests, context);
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
    action: InventoryAuditAction,
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
    const log_id = inventoryAuditLogId(entity_id, action, dto.timestamp);
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
