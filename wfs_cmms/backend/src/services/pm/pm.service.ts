import type { PredictiveEngineService } from "../../aimi/predictive/predictive-engine.service";
import type { SeverityEngineService } from "../../aimi/severity/severity-engine.service";
import type { Database } from "../../core/database/database.interface";
import { createPreparedStatement } from "../../core/database/prepared-statement";
import type { DtoRole } from "../../core/dto/base.dto";
import type { ContextDto } from "../../core/dto/context.dto";
import { createError } from "../../core/errors/error-factory";
import type { ErrorType } from "../../core/errors/error-types";
import type { EventBusService } from "../../core/event-bus/event-bus.service";
import type { LifecycleContext } from "../../core/lifecycle-engine/lifecycle-context";
import type { LifecycleEngineService } from "../../core/lifecycle-engine/lifecycle-engine.service";
import {
  createLifecycleSnapshot,
  type LifecycleSnapshot,
} from "../../core/lifecycle-engine/lifecycle-snapshot";
import type { LifecycleState } from "../../core/lifecycle-engine/lifecycle-state.interface";
import type { AuditLogHook, Logger } from "../../core/logger/logger.interface";
import { err } from "../../core/results/err";
import { ok } from "../../core/results/ok";
import type { Result } from "../../core/results/result.interface";
import type { ResultContext } from "../../core/results/result-context";
import type { RuleEngineService } from "../../core/rule-engine/rule-engine.service";
import { contextSchema, toRuleContext } from "../../core/validation/context.schema";
import { asRecord, asString } from "../../core/validation/dto.schema";
import { parseDtoRole } from "../../core/validation/role.schema";
import { PmAimiAdapter } from "./adapters/pm-aimi.adapter";
import { PmTelematicsAdapter } from "./adapters/pm-telematics.adapter";
import { isPmApiAllowed } from "./api/pm.api.permissions";
import {
  applyTemplateWrite,
  buildTemplateForSoftDelete,
  parsePmComplete,
  parsePmInstanceCreate,
  parsePmScheduleQuery,
  parsePmTemplateCreate,
  parsePmTemplateUpdate,
} from "./pm-builder";
import {
  incomingEventFromPmCompleted,
  pmAuditLogId,
  type PmAuditAction,
} from "./pm-events";
import {
  pmCompletedImmutableError,
  pmListError,
  pmReadError,
  pmWriteError,
} from "./pm-rules";
import {
  freezePmCompletion,
  freezePmScheduleListResult,
  freezePmTemplateListResult,
  type PmCompletion,
  type PmSchedule,
  type PmScheduleListResult,
  type PmTemplate,
  type PmTemplateListResult,
  type PmTrigger,
} from "./pm.interface";
import { PmFindingsEngine } from "./engines/pm-findings.engine";
import { PmPredictiveLinkEngine } from "./engines/pm-predictive-link.engine";
import { PmScheduleEngine } from "./engines/pm-schedule.engine";
import { PmSeverityEngine } from "./engines/pm-severity.engine";
import { PmTemplateEngine } from "./engines/pm-template.engine";
import { PmTriggerEngine } from "./engines/pm-trigger.engine";
import { filterSchedulesByAsset } from "./utils/pm-filters";

export type PmServiceOptions = {
  tenant_id: string;
  logger: Logger;
  database: Database;
  eventBus: EventBusService;
  auditLogHook: AuditLogHook;
  ruleEngine: RuleEngineService;
  lifecycleEngine: LifecycleEngineService;
  severityEngine: SeverityEngineService;
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

export class PmService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;
  private readonly eventBus: EventBusService;
  private readonly auditLogHook: AuditLogHook;
  private readonly ruleEngine: RuleEngineService;
  private readonly lifecycleEngine: LifecycleEngineService;
  private readonly templateEngine: PmTemplateEngine;
  private readonly scheduleEngine: PmScheduleEngine;
  private readonly triggerEngine: PmTriggerEngine;
  private readonly findingsEngine: PmFindingsEngine;
  private readonly severityEngine: PmSeverityEngine;
  private readonly predictiveLinkEngine: PmPredictiveLinkEngine;

  constructor(options: PmServiceOptions) {
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
    this.templateEngine = new PmTemplateEngine(options.tenant_id, options.database);
    this.scheduleEngine = new PmScheduleEngine(options.tenant_id, options.database);
    this.triggerEngine = new PmTriggerEngine(options.tenant_id, options.database);
    this.findingsEngine = new PmFindingsEngine(options.tenant_id, options.database);
    const telematicsAdapter = new PmTelematicsAdapter(options.tenant_id, options.database);
    const aimiAdapter = new PmAimiAdapter(
      options.severityEngine,
      options.predictiveEngine,
      telematicsAdapter,
    );
    this.severityEngine = new PmSeverityEngine(aimiAdapter);
    this.predictiveLinkEngine = new PmPredictiveLinkEngine(aimiAdapter, telematicsAdapter);
  }

  async listTemplates(contextInput: unknown): Promise<Result<PmTemplateListResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isPmApiAllowed("list_templates", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const templates = await this.templateEngine.loadList();
    if (templates === null) {
      return this.fail("tenant_id mismatch", context);
    }
    return ok(
      freezePmTemplateListResult({
        tenant_id: this.tenant_id,
        role: dto.role,
        templates,
      }),
      context,
    );
  }

  async createTemplate(contextInput: unknown, bodyInput: unknown): Promise<Result<PmTemplate>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isPmApiAllowed("create_template", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const writeGate = pmWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    if (dto.entity_id === "") {
      return this.fail("entity_id required", context);
    }
    const parsed = parsePmTemplateCreate(bodyInput);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType = parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      return this.fail(error_type, context);
    }
    const built = applyTemplateWrite(
      this.tenant_id,
      dto.entity_id,
      dto.timestamp,
      parsed.data,
      null,
    );
    if (built.success === false || built.value === null) {
      return this.fail(built.error_code, context);
    }
    await this.templateEngine.insert(built.value);
    await this.audit(dto, built.value.pm_template_id, "pm.template.created", "created");
    return ok(built.value, context);
  }

  async updateTemplate(
    contextInput: unknown,
    pm_template_id: string,
    bodyInput: unknown,
  ): Promise<Result<PmTemplate>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isPmApiAllowed("update_template", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const writeGate = pmWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    if (pm_template_id === "") {
      return this.fail("entity_id required", context);
    }
    const current = await this.templateEngine.load(pm_template_id);
    if (current === null) {
      return this.fail("entity_id mismatch", context);
    }
    const parsed = parsePmTemplateUpdate(bodyInput);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType = parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      return this.fail(error_type, context);
    }
    const built = applyTemplateWrite(
      this.tenant_id,
      pm_template_id,
      dto.timestamp,
      parsed.data,
      current,
    );
    if (built.success === false || built.value === null) {
      return this.fail(built.error_code, context);
    }
    await this.templateEngine.update(built.value);
    await this.audit(dto, built.value.pm_template_id, "pm.template.updated", "updated");
    return ok(built.value, context);
  }

  async deleteTemplate(contextInput: unknown, pm_template_id: string): Promise<Result<PmTemplate>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isPmApiAllowed("delete_template", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const writeGate = pmWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    if (pm_template_id === "") {
      return this.fail("entity_id required", context);
    }
    const current = await this.templateEngine.load(pm_template_id);
    if (current === null) {
      return this.fail("entity_id mismatch", context);
    }
    const built = buildTemplateForSoftDelete(current, dto.timestamp);
    if (built.success === false || built.value === null) {
      return this.fail(built.error_code, context);
    }
    await this.templateEngine.softDelete(built.value);
    await this.audit(dto, built.value.pm_template_id, "pm.template.deleted", "deleted");
    return ok(built.value, context);
  }

  async listSchedules(contextInput: unknown, queryInput: unknown): Promise<Result<PmScheduleListResult>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isPmApiAllowed("list_schedules", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const listGate = pmListError(dto.role, dto.entity_id);
    if (listGate !== "none") {
      return this.fail(listGate, context);
    }
    const query = parsePmScheduleQuery(queryInput);
    const loaded = await this.scheduleEngine.loadByAsset(query.asset_id);
    if (loaded === null) {
      return this.fail("tenant_id mismatch", context);
    }
    let schedules = loaded;
    if (dto.role === "DRIVER" || dto.role === "COMPLIANCE OFFICER") {
      schedules = filterSchedulesByAsset(loaded, dto.entity_id);
    }
    return ok(
      freezePmScheduleListResult({
        tenant_id: this.tenant_id,
        role: dto.role,
        schedules,
      }),
      context,
    );
  }

  async createInstance(contextInput: unknown, bodyInput: unknown): Promise<Result<PmSchedule>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isPmApiAllowed("create_instance", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const writeGate = pmWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    if (dto.entity_id === "") {
      return this.fail("entity_id required", context);
    }
    const parsed = parsePmInstanceCreate(bodyInput);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType = parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      return this.fail(error_type, context);
    }
    const template = await this.templateEngine.load(parsed.data.pm_template_id);
    if (template === null) {
      return this.fail("entity_id mismatch", context);
    }
    const meters = await this.scheduleEngine.loadAssetMeters(parsed.data.asset_id);
    const schedule = this.scheduleEngine.buildInstance(
      this.tenant_id,
      dto.entity_id,
      dto.timestamp,
      parsed.data,
      template,
      meters,
    );
    await this.scheduleEngine.insert(schedule);
    await this.lifecycleEngine.start({
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      kind: "pm",
      entity_id: schedule.pm_schedule_id,
      state: "PM_SCHEDULED",
      timestamp: dto.timestamp,
    });
    await this.audit(dto, schedule.pm_schedule_id, "pm.instance.created", "created");
    return ok(schedule, context);
  }

  async complete(
    contextInput: unknown,
    pm_schedule_id: string,
    bodyInput: unknown,
  ): Promise<Result<PmCompletion>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    if (isPmApiAllowed("complete", dto.role) === false) {
      return this.fail("role unauthorized", context);
    }
    const writeGate = pmWriteError(dto.role);
    if (writeGate !== "none") {
      return this.fail(writeGate, context);
    }
    if (pm_schedule_id === "") {
      return this.fail("entity_id required", context);
    }
    const schedule = await this.scheduleEngine.load(pm_schedule_id);
    if (schedule === null) {
      return this.fail("entity_id mismatch", context);
    }
    const immutable = pmCompletedImmutableError(schedule.status);
    if (immutable !== "none") {
      return this.fail(immutable, context);
    }
    const parsed = parsePmComplete(bodyInput);
    if (parsed.success === false || parsed.data === null) {
      const error_type: ErrorType = parsed.error_code === "none" ? "dto invalid" : parsed.error_code;
      return this.fail(error_type, context);
    }
    const finding = this.findingsEngine.buildFinding(schedule, parsed.data);
    const history = this.findingsEngine.buildHistory(
      pm_schedule_id + ":history:" + dto.timestamp,
      schedule,
      dto.timestamp,
    );
    await this.findingsEngine.insertHistory(history);
    let snapshot = createLifecycleSnapshot(
      {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        kind: "pm",
        entity_id: pm_schedule_id,
        state: "PM_SCHEDULED",
        timestamp: dto.timestamp,
      },
      "",
    );
    snapshot = await this.advancePmLifecycle(dto, snapshot, "PM_FINDINGS_LOGGED");
    const severity = await this.severityEngine.assign(dto, schedule, parsed.data, contextInput);
    snapshot = await this.advancePmLifecycle(dto, snapshot, "PM_COMPLETED");
    const predictive = await this.predictiveLinkEngine.link(dto, schedule, severity, contextInput);
    await this.advancePmLifecycle(dto, snapshot, "PM_PREDICTIVE_UPDATE");
    const completed = await this.scheduleEngine.markCompleted(schedule, dto.timestamp);
    await this.audit(dto, completed.pm_schedule_id, "pm.instance.completed", "completed");
    await this.eventBus.publish(incomingEventFromPmCompleted(dto, completed));
    return ok(
      freezePmCompletion({
        tenant_id: this.tenant_id,
        schedule: completed,
        history,
        finding,
        severity,
        predictive,
      }),
      context,
    );
  }

  async evaluateTriggers(contextInput: unknown, pm_schedule_id: string): Promise<Result<PmTrigger>> {
    const opened = await this.open(contextInput);
    if (opened.ok === false) {
      return opened;
    }
    const dto = opened.value;
    const context = resultContextFromDto(dto);
    const schedule = await this.scheduleEngine.load(pm_schedule_id);
    if (schedule === null) {
      return this.fail("entity_id mismatch", context);
    }
    const readGate = pmReadError(dto.role, dto.entity_id, schedule.asset_id);
    if (readGate !== "none") {
      return this.fail(readGate, context);
    }
    const trigger = await this.triggerEngine.evaluate(schedule);
    if (trigger === null) {
      return this.fail("tenant_id mismatch", context);
    }
    return ok(trigger, context);
  }

  private async advancePmLifecycle(
    dto: ContextDto,
    snapshot: LifecycleSnapshot,
    stop_state: LifecycleState,
  ): Promise<LifecycleSnapshot> {
    const order: LifecycleState[] = [
      "PM_SCHEDULED",
      "PM_ASSIGNED",
      "PM_IN_PROGRESS",
      "PM_FINDINGS_LOGGED",
      "PM_SEVERITY_ASSIGNED",
      "PM_COMPLETED",
      "PM_PREDICTIVE_UPDATE",
    ];
    let current = snapshot;
    let from_index = 0;
    let stop_index = 0;
    let index = 0;
    while (index < order.length) {
      if (order[index] === current.state) {
        from_index = index;
      }
      if (order[index] === stop_state) {
        stop_index = index;
      }
      index = index + 1;
    }
    while (from_index < stop_index) {
      const to_state = order[from_index + 1];
      const context: LifecycleContext = {
        tenant_id: dto.tenant_id,
        user_id: dto.user_id,
        role: dto.role,
        kind: "pm",
        entity_id: snapshot.entity_id,
        state: current.state,
        timestamp: dto.timestamp,
      };
      current = await this.lifecycleEngine.transition(current, context, to_state);
      from_index = from_index + 1;
    }
    return current;
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
    action: PmAuditAction,
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
    const log_id = pmAuditLogId(entity_id, action, dto.timestamp);
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
