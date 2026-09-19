/**
 * RuleEngine — Core
 * Master Blueprint V2 / AIMI-RULES §2–§3 / cursor-instructions §8
 * Immutable rule categories. No new AIMI modules.
 */

export type RuleCategory =
  | "tenant"
  | "rbac"
  | "severity"
  | "routing"
  | "scheduling"
  | "diagnostic"
  | "predictive"
  | "learning"
  | "insight"
  | "multilingual"
  | "voice"
  | "lifecycle";
