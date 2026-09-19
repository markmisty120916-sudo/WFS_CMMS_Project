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
import { isAssetApiAllowed } from "./api/asset.api.permissions";
import {
  buildAssetForCreate,
  buildAssetForSoftDelete,
  buildAssetForUpdate,
  buildAssetProfile,
  parseAssetListQuery,
  parseAssetWriteInput,
} from "./assets-builder";
import { assetAuditLogId, type AssetAuditAction } from "./assets-events";
import { assetListError, assetReadError, assetWriteError } from "./assets-rules";
import {
  freezeAssetListResult,
  type Asset,
  type AssetListResult,
  type AssetProfile,
} from "./assets.interface";
import { AssetHealthEngine } from "./engines/asset-health.engine";
import { AssetHistoryEngine } from "./engines/asset-history.engine";
import { AssetProfileEngine } from "./engines/asset-profile.engine";
import { AssetReadinessEngine } from "./engines/asset-readiness.engine";
import { AssetTelematicsEngine } from "./engines/asset-telematics.engine";
import { filterAssignedAssets, listQueryHasUnsupportedGroup } from "./utils/asset-filters";

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
  private readonly profileEngine: AssetProfileEngine;
  private readonly healthEngine: AssetHealthEngine;
  private readonly telematicsEngine: AssetTelematicsEngine;
  private readonly readinessEngine: AssetReadinessEngine;
  private readonly historyEngine: AssetHistoryEngine;

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
    this.profileEngine = new AssetProfileEngine(options.tenant_id, options.database);
    this.healthEngine = new AssetHealthEngine(options.tenant_id, options.database);
    this.telematicsEngine = new AssetTelematicsEngine(options.tenant_id, options.database);
    this.readinessEngine = new AssetReadinessEngine(options.tenant_id, options.database);
    this.historyEngine = new AssetHistoryEngine(options.tenant_id, options.database);
  }

  async list(contextInput: unknown, queryInput: unknown): Promise<Result<AssetListResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isAssetApiAllowed("list", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const listGate = assetListError(dto.role, dto.entity_id);
    if (listGate !== "none") {
      return this.fail(listGate, context);
    }
    const query = parseAssetListQuery(queryInput);
    if (query.success === false || query.data === null) {
      const error_type: ErrorType = query.error_code === "none" ? "dto invalid" : query.error_code;
      return this.fail(error_type, context);
    }
    if (listQueryHasUnsupportedGroup(query.data) === true) {
      return this.fail("dto invalid", context);
    }
    const loaded = await this.profileEngine.loadList(query.data.status);
    if (loaded === null) {
      return this.fail("tenant_id mismatch", context);
    }
    let assets = loaded;
    if (dto.role === "DRIVER" || dto.role === "TECHNICIAN") {
      assets = filterAssignedAssets(loaded, dto.entity_id);
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

  async get(contextInput: unknown, asset_id: string): Promise<Result<AssetProfile>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isAssetApiAllowed("get", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    if (asset_id === "") {
      return this.fail("entity_id required", context);
    }
    const readGate = assetReadError(dto.role, dto.entity_id, asset_id);
    if (readGate !== "none") {
      return this.fail(readGate, context);
    }
    const profile = await this.loadProfile(asset_id);
    if (profile === null) {
      return this.fail("entity_id mismatch", context);
    }
    return ok(profile, context);
  }

  async create(contextInput: unknown, bodyInput: unknown): Promise<Result<Asset>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isAssetApiAllowed("create", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const writeGate = assetWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    if (dto.entity_id === "") {
      return this.fail("entity_id required", context);
    }
    const parsedBody = parseAssetWriteInput(bodyInput, "create");
    if (parsedBody.success === false || parsedBody.data === null) {
      const error_type: ErrorType =
        parsedBody.error_code === "none" ? "dto invalid" : parsedBody.error_code;
      return this.fail(error_type, context);
    }
    const built = buildAssetForCreate(
      this.tenant_id,
      dto.entity_id,
      dto.timestamp,
      parsedBody.data,
    );
    if (built.success === false || built.value === null) {
      return this.fail(built.error_code, context);
    }
    await this.insertAsset(built.value);
    await this.auditAsset(dto, built.value, "asset.created", "created");
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
    if (isAssetApiAllowed("update", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const writeGate = assetWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    if (asset_id === "") {
      return this.fail("entity_id required", context);
    }
    const current = await this.profileEngine.load(asset_id);
    if (current === null) {
      return this.fail("entity_id mismatch", context);
    }
    const parsedBody = parseAssetWriteInput(bodyInput, "update");
    if (parsedBody.success === false || parsedBody.data === null) {
      const error_type: ErrorType =
        parsedBody.error_code === "none" ? "dto invalid" : parsedBody.error_code;
      return this.fail(error_type, context);
    }
    const built = buildAssetForUpdate(current, dto.timestamp, parsedBody.data);
    if (built.success === false || built.value === null) {
      return this.fail(built.error_code, context);
    }
    await this.updateAsset(built.value);
    await this.auditAsset(dto, built.value, "asset.updated", "updated");
    return ok(built.value, context);
  }

  async remove(contextInput: unknown, asset_id: string): Promise<Result<Asset>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isAssetApiAllowed("remove", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const writeGate = assetWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    if (asset_id === "") {
      return this.fail("entity_id required", context);
    }
    const current = await this.profileEngine.load(asset_id);
    if (current === null) {
      return this.fail("entity_id mismatch", context);
    }
    const built = buildAssetForSoftDelete(current, dto.timestamp);
    if (built.success === false || built.value === null) {
      return this.fail(built.error_code, context);
    }
    await this.softDeleteAsset(built.value);
    await this.auditAsset(dto, built.value, "asset.updated", "deleted");
    return ok(built.value, context);
  }

  private async loadProfile(asset_id: string): Promise<AssetProfile | null> {
    const asset = await this.profileEngine.load(asset_id);
    if (asset === null) {
      return null;
    }
    const health = await this.healthEngine.load(asset_id);
    if (health === "error") {
      return null;
    }
    const telematics = await this.telematicsEngine.load(asset_id);
    if (telematics === null) {
      return null;
    }
    const pm_schedules = await this.readinessEngine.loadPmSchedules(asset_id);
    if (pm_schedules === null) {
      return null;
    }
    const history = await this.historyEngine.load(asset_id);
    if (history === null) {
      return null;
    }
    const readiness = this.readinessEngine.build(asset, health, telematics, pm_schedules);
    return buildAssetProfile({
      asset,
      health,
      telematics,
      pm_schedules,
      history,
      meters: this.profileEngine.metersFromAsset(asset),
      readiness,
    });
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

  private async auditAsset(
    dto: ContextDto,
    asset: Asset,
    action: AssetAuditAction,
    new_value: string,
  ): Promise<void> {
    this.logger.info(action);
    this.auditLogHook.write({
      level: "info",
      message: action,
      tenant_id: asset.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      correlation_id: asset.asset_id,
      timestamp: asset.updated_at,
    });
    const log_id = assetAuditLogId(asset, action);
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
          action,
          previous_value: "",
          new_value,
        }),
        asset.updated_at,
      ],
    );
    await this.database.execute(statement);
  }
}
