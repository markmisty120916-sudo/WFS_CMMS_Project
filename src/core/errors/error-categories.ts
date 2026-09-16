/**
 * Errors Layer — Core
 * Master Blueprint V2 / AIMI-RULES §2
 * Error categories map to existing Core domains. No catch-all category.
 */

export type ErrorCategory =
  | "tenant"
  | "rbac"
  | "lifecycle"
  | "rule"
  | "event"
  | "database"
  | "dto"
  | "auth";
