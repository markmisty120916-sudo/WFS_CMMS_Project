/**
 * RuleEngine — Core
 * Master Blueprint V2 / AIMI-RULES §2.4–§2.5
 * No cross-tenant evaluation. No RBAC bypass. No dynamic rule creation.
 */

import type { RuleContext } from "./rule-context";
import type { RuleDefinition } from "./rule.interface";

export function findRule(
  catalog: readonly RuleDefinition[],
  rule_id: string,
): RuleDefinition | null {
  let index = 0;
  while (index < catalog.length) {
    const rule = catalog[index];
    index = index + 1;
    if (rule.rule_id === rule_id) {
      return rule;
    }
  }
  return null;
}

export function isRoleListed(
  allowed_roles: readonly RuleDefinition["allowed_roles"][number][],
  role: RuleDefinition["allowed_roles"][number],
): boolean {
  let index = 0;
  while (index < allowed_roles.length) {
    if (allowed_roles[index] === role) {
      return true;
    }
    index = index + 1;
  }
  return false;
}

export function assertTenantContext(engine_tenant_id: string, context: RuleContext): void {
  if (engine_tenant_id === "") {
    throw new Error("tenant_id required");
  }
  if (context.tenant_id === "") {
    throw new Error("tenant_id required");
  }
  if (context.tenant_id !== engine_tenant_id) {
    throw new Error("tenant_id mismatch");
  }
}

export function assertNoDynamicRuleCreation(): void {
  throw new Error("dynamic rule forbidden");
}
