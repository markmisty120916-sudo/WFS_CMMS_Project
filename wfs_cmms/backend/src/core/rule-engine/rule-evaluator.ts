/**
 * RuleEngine — Core
 * Master Blueprint V2 / AIMI-RULES §2.3 / cursor-instructions §10
 * Deterministic evaluation. Same inputs produce the same RuleResult.
 */

import { isRoleAllowedForKind, isTransitionAllowed } from "../lifecycle-engine/lifecycle-guards";
import type { LifecycleKind } from "../lifecycle-engine/lifecycle-state.interface";
import type { RuleCategory } from "./rule-categories";
import type { RuleContext } from "./rule-context";
import { findRule, isRoleListed } from "./rule-guards";
import { createRuleResult, type RuleResult } from "./rule-result";
import type { RuleDefinition, RuleRole } from "./rule.interface";

function lifecycleKindForCategory(category: RuleCategory): LifecycleKind | null {
  if (category === "lifecycle") {
    return null;
  }
  if (category === "diagnostic") {
    return "diagnostic";
  }
  if (category === "routing") {
    return "routing";
  }
  if (category === "scheduling") {
    return "scheduling";
  }
  return null;
}

function asLifecycleRole(role: RuleRole): Parameters<typeof isRoleAllowedForKind>[1] {
  return role;
}

export function evaluateRule(
  catalog: readonly RuleDefinition[],
  engine_tenant_id: string,
  context: RuleContext,
): RuleResult {
  if (context.tenant_id === "") {
    return createRuleResult(false, context.rule_id, "tenant", engine_tenant_id, context.user_id, "tenant_id required");
  }
  if (context.tenant_id !== engine_tenant_id) {
    return createRuleResult(false, context.rule_id, "tenant", context.tenant_id, context.user_id, "tenant_id mismatch");
  }

  const rule = findRule(catalog, context.rule_id);
  if (rule === null) {
    return createRuleResult(false, context.rule_id, "rbac", context.tenant_id, context.user_id, "rule unknown");
  }

  if (isRoleListed(rule.allowed_roles, context.role) === false) {
    return createRuleResult(false, rule.rule_id, rule.category, context.tenant_id, context.user_id, "role unauthorized");
  }

  if (rule.category === "tenant") {
    return createRuleResult(true, rule.rule_id, rule.category, context.tenant_id, context.user_id, "none");
  }

  if (rule.category === "rbac") {
    return createRuleResult(true, rule.rule_id, rule.category, context.tenant_id, context.user_id, "none");
  }

  if (rule.category === "lifecycle") {
    if (context.lifecycle_kind === "") {
      return createRuleResult(false, rule.rule_id, rule.category, context.tenant_id, context.user_id, "lifecycle transition invalid");
    }
    if (isRoleAllowedForKind(context.lifecycle_kind, asLifecycleRole(context.role)) === false) {
      return createRuleResult(false, rule.rule_id, rule.category, context.tenant_id, context.user_id, "role unauthorized");
    }
    const allowed = isTransitionAllowed({
      kind: context.lifecycle_kind,
      from_state: context.from_state,
      to_state: context.to_state,
    });
    if (allowed === false) {
      return createRuleResult(false, rule.rule_id, rule.category, context.tenant_id, context.user_id, "lifecycle transition invalid");
    }
    return createRuleResult(true, rule.rule_id, rule.category, context.tenant_id, context.user_id, "none");
  }

  const mapped = lifecycleKindForCategory(rule.category);
  if (mapped !== null) {
    if (isRoleAllowedForKind(mapped, asLifecycleRole(context.role)) === false) {
      return createRuleResult(false, rule.rule_id, rule.category, context.tenant_id, context.user_id, "role unauthorized");
    }
  }

  return createRuleResult(true, rule.rule_id, rule.category, context.tenant_id, context.user_id, "none");
}
