/**
 * Errors Layer — Core
 * Master Blueprint V2 / AIMI-RULES §2.3
 * Closed error-type set from existing Core throws. No unknown/internal catch-all.
 */

export type ErrorType =
  | "tenant_id required"
  | "tenant_id mismatch"
  | "user_id required"
  | "role unauthorized"
  | "role invalid"
  | "timestamp required"
  | "dto invalid"
  | "lifecycle transition invalid"
  | "lifecycle kind mismatch"
  | "lifecycle state mismatch"
  | "lifecycle postcondition failed"
  | "entity_id required"
  | "entity_id mismatch"
  | "state required"
  | "rule unknown"
  | "rule_id required"
  | "dynamic rule forbidden"
  | "event_id required"
  | "event_type required"
  | "event_type invalid"
  | "event_source required"
  | "event_category mismatch"
  | "event payload invalid"
  | "replay modified"
  | "prepared statement required"
  | "soft delete required"
  | "database config required"
  | "connection pool exhausted"
  | "jwt required"
  | "jwt invalid";
