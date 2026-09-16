/**
 * RuleEngine — Core
 * Master Blueprint V2 / AIMI-RULES §4.1
 * Evaluates a frozen catalog. Does not add or mutate rules.
 */

import type { Database } from "../database/database.interface";
import { createPreparedStatement } from "../database/prepared-statement";
import type { EventBusService } from "../event-bus/event-bus.service";
import type { AuditLogHook, Logger } from "../logger/logger.interface";
import type { RuleContext } from "./rule-context";
import { evaluateRule } from "./rule-evaluator";
import { assertNoDynamicRuleCreation, assertTenantContext } from "./rule-guards";
import type { RuleResult } from "./rule-result";
import { freezeRule, type RuleDefinition } from "./rule.interface";

export type RuleEngineServiceOptions = {
  tenant_id: string;
  logger: Logger;
  database: Database;
  eventBus: EventBusService;
  auditLogHook: AuditLogHook;
  rules: readonly RuleDefinition[];
};

export class RuleEngineService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;
  private readonly eventBus: EventBusService;
  private readonly auditLogHook: AuditLogHook;
  private readonly rules: readonly RuleDefinition[];

  constructor(options: RuleEngineServiceOptions) {
    if (options.tenant_id === "") {
      throw new Error("tenant_id required");
    }
    const frozen: RuleDefinition[] = [];
    let index = 0;
    while (index < options.rules.length) {
      frozen.push(freezeRule(options.rules[index]));
      index = index + 1;
    }
    this.tenant_id = options.tenant_id;
    this.logger = options.logger;
    this.database = options.database;
    this.eventBus = options.eventBus;
    this.auditLogHook = options.auditLogHook;
    this.rules = Object.freeze(frozen);
  }

  addRule(_rule: RuleDefinition): never {
    assertNoDynamicRuleCreation();
  }

  async evaluate(context: RuleContext): Promise<RuleResult> {
    assertTenantContext(this.tenant_id, context);
    const result = evaluateRule(this.rules, this.tenant_id, context);

    this.logger.info("rule.evaluate");
    this.auditLogHook.write({
      level: "info",
      message: "rule.evaluate",
      tenant_id: result.tenant_id,
      user_id: result.user_id,
      role: context.role,
      correlation_id: result.rule_id,
      timestamp: context.timestamp,
    });

    let severity = "S5 Info";
    if (result.allowed === false) {
      severity = "S3 Medium";
    }

    const log_id = result.rule_id + ":" + context.timestamp;
    const statement = createPreparedStatement(
      "INSERT INTO IntegrationLogs (log_id, tenant_id, event_id, message, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $5, NULL)",
      [
        result.tenant_id,
        log_id,
        log_id,
        JSON.stringify({
          tenant_id: result.tenant_id,
          user_id: result.user_id,
          role: context.role,
          timestamp: context.timestamp,
          action: "rule.evaluate",
          previous_value: "",
          new_value: result.error_code,
        }),
        context.timestamp,
      ],
    );
    await this.database.execute(statement);

    await this.eventBus.publish({
      event_id: log_id,
      event_type: "notification.generated",
      event_source: "rule-engine",
      event_payload: {
        category: result.category,
        severity,
      },
      tenant_id: result.tenant_id,
      user_id: result.user_id,
      role: context.role,
      timestamp: context.timestamp,
    });

    return result;
  }
}
