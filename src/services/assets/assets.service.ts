/**
 * Assets Service
 * Master Blueprint V2 / architecture.md §3.2 / API-SPEC §3 / BACKEND-STRUCTURE §9
 * Tenant-scoped asset CRUD. AIMI health is read-only. No global instance.
 */

import type { Database } from "../../core/database/database.interface";
import {
  createPreparedStatement,
  type PreparedStatement,
} from "../../core/database/prepared-statement";
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
import {
  buildAssetForCreate,
  buildAssetForSoftDelete,
  buildAssetForUpdate,
  buildAssetFromRow,
  buildAssetHealthFromRow,
  buildAssetTelematicsFromRow,
  parseAssetListQuery,
  parseAssetWriteInput,
} from "./assets-builder";
import { assetAuditLogId } from "./assets-events";
import { assetListError, assetReadError, assetWriteError } from "./assets-rules";
import {
  freezeAssetDetail,
  freezeAssetListResult,
  type Asset,
  type AssetDetail,
  type AssetHealth,
  type AssetListResult,
  type AssetTelematics,
} from "./assets.interface";

export type AssetsServiceOptions = {
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

export class AssetsService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;
  private readonly eventBus: EventBusService;
  private readonly auditLogHook: AuditLogHook;
  private readonly ruleEngine: RuleEngineService;
  private readonly lifecycleEngine: LifecycleEngineService;

  constructor(options: AssetsServiceOptions) {
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

  async list(contextInput: unknown, queryInput: unknown): Promise<Result<AssetListResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);

    const listGate = assetListError(dto.role, dto.entity_id);
    if (listGate !== "none") {
      return this.fail(listGate, context);
    }

    const query = parseAssetListQuery(queryInput);
    if (query.success === false || query.value === null) {
      return this.fail(query.error_code, context);
    }

    if (dto.role === "DRIVER") {
      const assigned = await this.loadAsset(dto.entity_id);
      if (assigned === null) {
        return this.fail("entity_id mismatch", context);
      }
      const assignedRead = assetReadError(dto.role, dto.entity_id, assigned.asset_id);
      if (assignedRead !== "none") {
        return this.fail(assignedRead, context);
      }
      return ok(
        freezeAssetListResult({
          tenant_id: this.tenant_id,
          role: dto.role,
          assets: [assigned],
        }),
        context,
      );
    }

    const assets = await this.loadAssetList(query.value.status);
    if (assets === null) {
      return this.fail("tenant_id mismatch", context);
    }
    return ok(
      freezeAssetListResult({
        tenant_id: this.tenant_id,
        role: dto.role,
        assets,
      }),
      context,
    );
  }

  async get(contextInput: unknown, asset_id: string): Promise<Result<AssetDetail>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);

    if (asset_id === "") {
      return this.fail("entity_id required", context);
    }
    const readGate = assetReadError(dto.role, dto.entity_id, asset_id);
    if (readGate !== "none") {
      return this.fail(readGate, context);
    }

    const asset = await this.loadAsset(asset_id);
    if (asset === null) {
      return this.fail("entity_id mismatch", context);
    }
    const health = await this.loadHealth(asset_id);
    if (health === "error") {
      return this.fail("tenant_id mismatch", context);
    }
    const telematics = await this.loadTelematics(asset_id);
    if (telematics === null) {
      return this.fail("tenant_id mismatch", context);
    }
    return ok(
      freezeAssetDetail({
        asset,
        health,
        telematics,
      }),
      context,
    );
  }

  async create(contextInput: unknown, bodyInput: unknown): Promise<Result<Asset>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);

    const writeGate = assetWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    if (dto.entity_id === "") {
      return this.fail("entity_id required", context);
    }

    const parsedBody = parseAssetWriteInput(bodyInput);
    if (parsedBody.success === false || parsedBody.value === null) {
      return this.fail(parsedBody.error_code, context);
    }
    const built = buildAssetForCreate(
      this.tenant_id,
      dto.entity_id,
      dto.timestamp,
      parsedBody.value,
    );
    if (built.success === false || built.value === null) {
      return this.fail(built.error_code, context);
    }

    await this.insertAsset(built.value);
    await this.auditAsset(dto, built.value, "created");
    return ok(built.value, context);
  }

  async update(
    contextInput: unknown,
    asset_id: string,
    bodyInput: unknown,
  ): Promise<Result<Asset>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);

    const writeGate = assetWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    if (asset_id === "") {
      return this.fail("entity_id required", context);
    }

    const current = await this.loadAsset(asset_id);
    if (current === null) {
      return this.fail("entity_id mismatch", context);
    }
    const parsedBody = parseAssetWriteInput(bodyInput);
    if (parsedBody.success === false || parsedBody.value === null) {
      return this.fail(parsedBody.error_code, context);
    }
    const built = buildAssetForUpdate(current, dto.timestamp, parsedBody.value);
    if (built.success === false || built.value === null) {
      return this.fail(built.error_code, context);
    }

    await this.updateAsset(built.value);
    await this.auditAsset(dto, built.value, "updated");
    return ok(built.value, context);
  }

  async remove(contextInput: unknown, asset_id: string): Promise<Result<Asset>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);

    const writeGate = assetWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    if (asset_id === "") {
      return this.fail("entity_id required", context);
    }

    const current = await this.loadAsset(asset_id);
    if (current === null) {
      return this.fail("entity_id mismatch", context);
    }
    const built = buildAssetForSoftDelete(current, dto.timestamp);
    if (built.success === false || built.value === null) {
      return this.fail(built.error_code, context);
    }

    await this.softDeleteAsset(built.value);
    await this.auditAsset(dto, built.value, "deleted");
    return ok(built.value, context);
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

  private async loadAsset(asset_id: string): Promise<Asset | null> {
    const statement = createPreparedStatement(
      "SELECT asset_id, tenant_id, vin, unit_number, make, model, year, mileage, hours, status, created_at, updated_at, deleted_at FROM Assets WHERE tenant_id = $1 AND asset_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, asset_id],
    );
    const result = await this.database.execute(statement);
    if (result.rows.length === 0) {
      return null;
    }
    const built = buildAssetFromRow(this.tenant_id, result.rows[0]);
    if (built.success === false || built.value === null) {
      return null;
    }
    return built.value;
  }

  private async loadAssetList(status: string): Promise<readonly Asset[] | null> {
    let statement: PreparedStatement;
    if (status === "") {
      statement = createPreparedStatement(
        "SELECT asset_id, tenant_id, vin, unit_number, make, model, year, mileage, hours, status, created_at, updated_at, deleted_at FROM Assets WHERE tenant_id = $1 AND deleted_at IS NULL",
        [this.tenant_id],
      );
    } else {
      statement = createPreparedStatement(
        "SELECT asset_id, tenant_id, vin, unit_number, make, model, year, mileage, hours, status, created_at, updated_at, deleted_at FROM Assets WHERE tenant_id = $1 AND deleted_at IS NULL AND status = $2",
        [this.tenant_id, status],
      );
    }
    const result = await this.database.execute(statement);
    const assets: Asset[] = [];
    let index = 0;
    while (index < result.rows.length) {
      const built = buildAssetFromRow(this.tenant_id, result.rows[index]);
      if (built.success === false || built.value === null) {
        return null;
      }
      assets.push(built.value);
      index = index + 1;
    }
    return assets;
  }

  private async loadHealth(asset_id: string): Promise<AssetHealth | null | "error"> {
    const statement = createPreparedStatement(
      "SELECT health_id, tenant_id, asset_id, health_score, predictive_score, last_update, created_at, updated_at, deleted_at FROM AssetHealth WHERE tenant_id = $1 AND asset_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, asset_id],
    );
    const result = await this.database.execute(statement);
    if (result.rows.length === 0) {
      return null;
    }
    const built = buildAssetHealthFromRow(this.tenant_id, asset_id, result.rows[0]);
    if (built.success === false || built.value === null) {
      return "error";
    }
    return built.value;
  }

  private async loadTelematics(asset_id: string): Promise<readonly AssetTelematics[] | null> {
    const statement = createPreparedStatement(
      "SELECT telematics_id, tenant_id, asset_id, fault_code, fault_description, severity, timestamp, created_at, updated_at, deleted_at FROM AssetTelematics WHERE tenant_id = $1 AND asset_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, asset_id],
    );
    const result = await this.database.execute(statement);
    const rows: AssetTelematics[] = [];
    let index = 0;
    while (index < result.rows.length) {
      const built = buildAssetTelematicsFromRow(this.tenant_id, asset_id, result.rows[index]);
      if (built.success === false || built.value === null) {
        return null;
      }
      rows.push(built.value);
      index = index + 1;
    }
    return rows;
  }

  private async insertAsset(asset: Asset): Promise<void> {
    const statement = createPreparedStatement(
      "INSERT INTO Assets (asset_id, tenant_id, vin, unit_number, make, model, year, mileage, hours, status, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11, NULL)",
      [
        asset.tenant_id,
        asset.asset_id,
        asset.vin,
        asset.unit_number,
        asset.make,
        asset.model,
        asset.year,
        asset.mileage,
        asset.hours,
        asset.status,
        asset.created_at,
      ],
    );
    await this.database.execute(statement);
  }

  private async updateAsset(asset: Asset): Promise<void> {
    const statement = createPreparedStatement(
      "UPDATE Assets SET vin = $3, unit_number = $4, make = $5, model = $6, year = $7, mileage = $8, hours = $9, status = $10, updated_at = $11 WHERE tenant_id = $1 AND asset_id = $2 AND deleted_at IS NULL",
      [
        asset.tenant_id,
        asset.asset_id,
        asset.vin,
        asset.unit_number,
        asset.make,
        asset.model,
        asset.year,
        asset.mileage,
        asset.hours,
        asset.status,
        asset.updated_at,
      ],
    );
    await this.database.execute(statement);
  }

  private async softDeleteAsset(asset: Asset): Promise<void> {
    if (asset.deleted_at === null) {
      throw new Error("soft delete required");
    }
    const statement = createPreparedStatement(
      "UPDATE Assets SET deleted_at = $3, updated_at = $3 WHERE tenant_id = $1 AND asset_id = $2 AND deleted_at IS NULL",
      [asset.tenant_id, asset.asset_id, asset.deleted_at],
    );
    await this.database.execute(statement);
  }

  private async auditAsset(dto: ContextDto, asset: Asset, new_value: string): Promise<void> {
    this.logger.info("asset.updated");
    this.auditLogHook.write({
      level: "info",
      message: "asset.updated",
      tenant_id: asset.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      correlation_id: asset.asset_id,
      timestamp: asset.updated_at,
    });
    const log_id = assetAuditLogId(asset, "asset.updated");
    const statement = createPreparedStatement(
      "INSERT INTO IntegrationLogs (log_id, tenant_id, event_id, message, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $5, NULL)",
      [
        asset.tenant_id,
        log_id,
        log_id,
        JSON.stringify({
          tenant_id: asset.tenant_id,
          user_id: dto.user_id,
          role: dto.role,
          asset_id: asset.asset_id,
          timestamp: asset.updated_at,
          action: "asset.updated",
          previous_value: "",
          new_value,
        }),
        asset.updated_at,
      ],
    );
    await this.database.execute(statement);
  }
}
