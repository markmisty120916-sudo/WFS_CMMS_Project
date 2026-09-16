/**
 * RuleEngine — Core
 * Master Blueprint V2 / AIMI-RULES §2 / RBAC §2
 * Immutable rule definition. Catalog is injected; rules are not created at runtime.
 */

import type { RuleCategory } from "./rule-categories";

export type RuleRole =
  | "DRIVER"
  | "TECHNICIAN"
  | "MASTER TECHNICIAN"
  | "PARTS MANAGER"
  | "FLEET MANAGER"
  | "COMPLIANCE OFFICER"
  | "ADMIN"
  | "SILENT MASTER KEY";

export type RuleDefinition = {
  readonly rule_id: string;
  readonly category: RuleCategory;
  readonly allowed_roles: readonly RuleRole[];
};

export function freezeRule(rule: RuleDefinition): RuleDefinition {
  if (rule.rule_id === "") {
    throw new Error("rule_id required");
  }
  return Object.freeze({
    rule_id: rule.rule_id,
    category: rule.category,
    allowed_roles: Object.freeze(rule.allowed_roles),
  });
}
