import type { DiagnosticsEngineService } from "../../aimi/diagnostics/diagnostics-engine.service";
import type { DiagnosticsOutput } from "../../aimi/diagnostics/diagnostics-output.interface";
import type { PredictiveEngineService } from "../../aimi/predictive/predictive-engine.service";
import type { PredictiveOutput } from "../../aimi/predictive/predictive-output.interface";
import type { RoutingEngineService } from "../../aimi/routing/routing-engine.service";
import type { RoutingOutput } from "../../aimi/routing/routing-output.interface";
import type { SchedulingEngineService } from "../../aimi/scheduling/scheduling-engine.service";
import type { SchedulingOutput } from "../../aimi/scheduling/scheduling-output.interface";
import type { SeverityEngineService } from "../../aimi/severity/severity-engine.service";
import type { SeverityOutput } from "../../aimi/severity/severity-output.interface";
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
import { DriverDefectAimiAdapter } from "./adapters/driver-defect-aimi.adapter";
import { DriverDefectTelematicsAdapter } from "./adapters/driver-defect-telematics.adapter";
import { isDriverDefectApiAllowed } from "./api/driver-defect.api.permissions";
import { DriverDefectHistoryEngine } from "./engines/driver-defect-history.engine";
import { DriverDefectIntakeEngine } from "./engines/driver-defect-intake.engine";
import { DriverDefectPredictiveEngine } from "./engines/driver-defect-predictive.engine";
import { DriverDefectRoutingEngine } from "./engines/driver-defect-routing.engine";
import { DriverDefectSeverityEngine } from "./engines/driver-defect-severity.engine";
import {
  applyDriverDefectSoftDelete,
  parseDriverDefectCreate,
  parseDriverDefectListQuery,
  parseDriverDefectStatus,
  parseDriverDefectUpdate,
} from "./driver-defect-builder";
import {
  driverDefectAuditLogId,
  incomingEventFromDriverDefectCreated,
  type DriverDefectAuditAction,
} from "./driver-defect-events";
import {
  canPublishDriverDefectEvent,
  driverDefectCreateError,
  driverDefectManageError,
  driverDefectReadError,
} from "./driver-defect-rules";
import {
  freezeDriverDefectActionResult,
  freezeDriverDefectListResult,
  type DriverDefect,
  type DriverDefectActionResult,
  type DriverDefectListResult,
  type DriverDefectPhoto,
} from "./driver-defect.interface";
import { filterDefectsByAsset, filterDefectsByStatus } from "./utils/driver-defect-filters";

export type DriverDefectServiceOptions = {
  tenant_id: string;
  logger: Logger;
  database: Database;
  eventBus: EventBusService;
  auditLogHook: AuditLogHook;
  ruleEngine: RuleEngineService;
  lifecycleEngine: LifecycleEngineService;
  severityEngine: SeverityEngineService;
  routingEngine: RoutingEngineService;
  schedulingEngine: SchedulingEngineService;
  diagnosticsEngine: DiagnosticsEngineService;
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

export class DriverDefectService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;
  private readonly eventBus: EventBusService;
  private readonly auditLogHook: AuditLogHook;
  private readonly ruleEngine: RuleEngineService;
  private readonly lifecycleEngine: LifecycleEngineService;
  private readonly intakeEngine: DriverDefectIntakeEngine;
  private readonly severityEngine: DriverDefectSeverityEngine;
  private readonly routingEngine: DriverDefectRoutingEngine;
  private readonly predictiveEngine: DriverDefectPredictiveEngine;
  private readonly historyEngine: DriverDefectHistoryEngine;

  constructor(options: DriverDefectServiceOptions) {
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
    const telematicsAdapter = new DriverDefectTelematicsAdapter(options.tenant_id, options.database);
    const aimiAdapter = new DriverDefectAimiAdapter(
      options.severityEngine,
      options.routingEngine,
      options.schedulingEngine,
      options.diagnosticsEngine,
      options.predictiveEngine,
      telematicsAdapter,
    );
    this.intakeEngine = new DriverDefectIntakeEngine(options.tenant_id, options.database);
    this.severityEngine = new DriverDefectSeverityEngine(aimiAdapter);
    this.routingEngine = new DriverDefectRoutingEngine(aimiAdapter);
    this.predictiveEngine = new DriverDefectPredictiveEngine(aimiAdapter, telematicsAdapter);
    this.historyEngine = new DriverDefectHistoryEngine(options.tenant_id, options.database);
  }

  async listDefects(contextInput: unknown, queryInput: unknown): Promise<Result<DriverDefectListResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isDriverDefectApiAllowed("list_defects", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const readGate = driverDefectReadError(dto.role);
    if (readGate !== "none") {
      return this.fail(readGate, context);
    }
    const loaded = await this.historyEngine.loadList();
    if (loaded === null) {
      return this.fail("tenant_id mismatch", context);
    }
    const query = parseDriverDefectListQuery(queryInput);
    let defects = filterDefectsByAsset(loaded, query.asset_id);
    defects = filterDefectsByStatus(defects, query.status);
    if (dto.role === "DRIVER") {
      defects = filterDefectsByAsset(defects, dto.entity_id);
    }
    return ok(
      freezeDriverDefectListResult({
        tenant_id: this.tenant_id,
        role: dto.role,
        defects,
      }),
      context,
    );
  }

  async getDefect(contextInput: unknown, defect_id: string): Promise<Result<DriverDefectActionResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isDriverDefectApiAllowed("get_defect", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const readGate = driverDefectReadError(dto.role);
    if (readGate !== "none") {
      return this.fail(readGate, context);
    }
    if (defect_id === "") {
      return this.fail("entity_id required", context);
    }
    const defect = await this.intakeEngine.load(defect_id);
    if (defect === null) {
      return this.fail("entity_id mismatch", context);
    }
    if (dto.role === "DRIVER") {
      if (defect.asset_id !== dto.entity_id) {
        return this.fail("role unauthorized", context);
      }
    }
    const photos = await this.intakeEngine.loadPhotos(defect.defect_id);
    if (photos === null) {
      return this.fail("tenant_id mismatch", context);
    }
    let photo: DriverDefectPhoto | null = null;
    if (photos.length > 0) {
      photo = photos[0];
    }
    return ok(this.toActionResult(defect, photo, null, false, false), context);
  }

  async createDefect(contextInput: unknown, bodyInput: unknown): Promise<Result<DriverDefectActionResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isDriverDefectApiAllowed("create_defect", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const createGate = driverDefectCreateError(dto.role);
    if (createGate !== "none") {
      return this.fail(createGate, context);
    }
    if (dto.entity_id === "") {
      return this.fail("entity_id required", context);
    }
    const parsed = parseDriverDefectCreate(bodyInput);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType = parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      return this.fail(error_type, context);
    }
    if (dto.role === "DRIVER") {
      if (dto.entity_id !== parsed.data.asset_id) {
        return this.fail("role unauthorized", context);
      }
    }
    const defect = this.intakeEngine.applyCreate(
      this.tenant_id,
      dto.entity_id,
      dto.timestamp,
      parsed.data,
    );
    await this.intakeEngine.insert(defect);
    await this.intakeEngine.insertWorkorder(defect, dto.user_id);
    const photo = this.intakeEngine.buildPhoto(
      this.tenant_id,
      defect.defect_id + ":photo:" + dto.timestamp,
      defect.defect_id,
      dto.user_id,
      parsed.data.photo_url,
      dto.timestamp,
    );
    if (photo !== null) {
      await this.intakeEngine.insertPhoto(photo);
    }
    const aimi = await this.runAimi(dto, defect, contextInput);
    await this.audit(dto, defect.defect_id, "driver.defect.created", defect.status);
    if (canPublishDriverDefectEvent(dto.role) === true) {
      await this.eventBus.publish(incomingEventFromDriverDefectCreated(dto, defect));
    }
    return ok(
      this.toActionResult(defect, photo, aimi, parsed.data.voice, parsed.data.multilingual),
      context,
    );
  }

  async updateDefect(
    contextInput: unknown,
    defect_id: string,
    bodyInput: unknown,
  ): Promise<Result<DriverDefectActionResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isDriverDefectApiAllowed("update_defect", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const manageGate = driverDefectManageError(dto.role);
    if (manageGate !== "none") {
      return this.fail(manageGate, context);
    }
    if (defect_id === "") {
      return this.fail("entity_id required", context);
    }
    const current = await this.intakeEngine.load(defect_id);
    if (current === null) {
      return this.fail("entity_id mismatch", context);
    }
    const parsed = parseDriverDefectUpdate(bodyInput);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType = parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      return this.fail(error_type, context);
    }
    const statusParsed = parseDriverDefectStatus(bodyInput);
    let status = "";
    if (statusParsed.success === true && statusParsed.data !== null) {
      status = statusParsed.data.status;
    }
    const defect = this.intakeEngine.applyUpdate(current, dto.timestamp, parsed.data, status);
    await this.intakeEngine.update(defect);
    await this.intakeEngine.updateWorkorder(defect);
    const photo = this.intakeEngine.buildPhoto(
      this.tenant_id,
      defect.defect_id + ":photo:" + dto.timestamp,
      defect.defect_id,
      dto.user_id,
      parsed.data.photo_url,
      dto.timestamp,
    );
    if (photo !== null) {
      await this.intakeEngine.insertPhoto(photo);
    }
    const aimi = await this.runAimi(dto, defect, contextInput);
    await this.audit(dto, defect.defect_id, "driver.defect.updated", defect.status);
    return ok(
      this.toActionResult(defect, photo, aimi, parsed.data.voice, parsed.data.multilingual),
      context,
    );
  }

  async deleteDefect(contextInput: unknown, defect_id: string): Promise<Result<DriverDefect>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isDriverDefectApiAllowed("delete_defect", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const manageGate = driverDefectManageError(dto.role);
    if (manageGate !== "none") {
      return this.fail(manageGate, context);
    }
    if (defect_id === "") {
      return this.fail("entity_id required", context);
    }
    const current = await this.intakeEngine.load(defect_id);
    if (current === null) {
      return this.fail("entity_id mismatch", context);
    }
    const built = applyDriverDefectSoftDelete(current, dto.timestamp);
    if (built.success === false || built.value === null) {
      return this.fail(built.error_code, context);
    }
    await this.intakeEngine.softDelete(built.value);
    await this.audit(dto, built.value.defect_id, "driver.defect.updated", "deleted");
    return ok(built.value, context);
  }

  private async runAimi(
    dto: ContextDto,
    defect: DriverDefect,
    contextInput: unknown,
  ): Promise<{
    severity: SeverityOutput | null;
    routing: RoutingOutput | null;
    scheduling: SchedulingOutput | null;
    diagnostics: DiagnosticsOutput | null;
    predictive: PredictiveOutput | null;
  }> {
    const severity = await this.severityEngine.classify(dto, defect, contextInput);
    const routing = await this.routingEngine.assign(dto, defect, severity, contextInput);
    const scheduling = await this.routingEngine.schedule(dto, defect, severity, routing, contextInput);
    const predictive = await this.predictiveEngine.forecast(dto, defect, severity, contextInput);
    const diagnostics = await this.routingEngine.diagnose(
      dto,
      defect,
      severity,
      routing,
      scheduling,
      predictive,
      contextInput,
    );
    return { severity, routing, scheduling, diagnostics, predictive };
  }

  private toActionResult(
    defect: DriverDefect,
    photo: DriverDefectPhoto | null,
    aimi: {
      severity: SeverityOutput | null;
      routing: RoutingOutput | null;
      scheduling: SchedulingOutput | null;
      diagnostics: DiagnosticsOutput | null;
      predictive: PredictiveOutput | null;
    } | null,
    voice: boolean,
    multilingual: boolean,
  ): DriverDefectActionResult {
    let severity: SeverityOutput | null = null;
    let routing: RoutingOutput | null = null;
    let scheduling: SchedulingOutput | null = null;
    let diagnostics: DiagnosticsOutput | null = null;
    let predictive: PredictiveOutput | null = null;
    if (aimi !== null) {
      severity = aimi.severity;
      routing = aimi.routing;
      scheduling = aimi.scheduling;
      diagnostics = aimi.diagnostics;
      predictive = aimi.predictive;
    }
    return freezeDriverDefectActionResult({
      tenant_id: this.tenant_id,
      defect,
      photo,
      severity,
      routing,
      scheduling,
      diagnostics,
      predictive,
      voice,
      multilingual,
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

  private async audit(
    dto: ContextDto,
    entity_id: string,
    action: DriverDefectAuditAction,
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
    const log_id = driverDefectAuditLogId(entity_id, action, dto.timestamp);
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
