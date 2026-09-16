/**
 * RuleEngine — Core
 * Master Blueprint V2 / AIMI-RULES / BACKEND-STRUCTURE §4
 * Factory only. No Nest runtime. No global rule catalog.
 */

import { RuleEngineService, type RuleEngineServiceOptions } from "./rule-engine.service";

export class RuleEngineModule {
  static create(options: RuleEngineServiceOptions): RuleEngineService {
    return new RuleEngineService(options);
  }
}

export { RuleEngineService } from "./rule-engine.service";
export type { RuleEngineServiceOptions } from "./rule-engine.service";
export type { RuleCategory } from "./rule-categories";
export type { RuleContext } from "./rule-context";
export type { RuleErrorCode, RuleResult } from "./rule-result";
export { createRuleResult } from "./rule-result";
export type { RuleDefinition, RuleRole } from "./rule.interface";
export { freezeRule } from "./rule.interface";
export { evaluateRule } from "./rule-evaluator";
export {
  assertNoDynamicRuleCreation,
  assertTenantContext,
  findRule,
  isRoleListed,
} from "./rule-guards";
