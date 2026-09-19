/**
 * RuleEngine — Core
 * Master Blueprint V2 / AIMI-RULES §2.3
 * Strict result pattern. All fields present. No partial assembly.
 */

import type { RuleCategory } from "./rule-categories";

export type RuleErrorCode =
  | "none"
  | "tenant_id required"
  | "tenant_id mismatch"
  | "role unauthorized"
  | "rule unknown"
  | "lifecycle transition invalid"
  | "dynamic rule forbidden";

export type RuleResult = {
  readonly allowed: boolean;
  readonly rule_id: string;
  readonly category: RuleCategory;
  readonly tenant_id: string;
  readonly user_id: string;
  readonly error_code: RuleErrorCode;
};

export function createRuleResult(
  allowed: boolean,
  rule_id: string,
  category: RuleCategory,
  tenant_id: string,
  user_id: string,
  error_code: RuleErrorCode,
): RuleResult {
  return Object.freeze({
    allowed,
    rule_id,
    category,
    tenant_id,
    user_id,
    error_code,
  });
}
