/**
 * Errors Layer — Core
 * Master Blueprint V2 / AIMI-RULES §2.1
 * Maps closed ErrorType values to categories. Unlisted types are not created.
 */

import type { ErrorCategory } from "./error-categories";
import type { ErrorContext } from "./error-context";
import type { CoreError } from "./error.interface";
import type { ErrorType } from "./error-types";

export function categoryForErrorType(error_type: ErrorType): ErrorCategory {
  if (error_type === "tenant_id required") {
    return "tenant";
  }
  if (error_type === "tenant_id mismatch") {
    return "tenant";
  }
  if (error_type === "user_id required") {
    return "tenant";
  }
  if (error_type === "role unauthorized") {
    return "rbac";
  }
  if (error_type === "role invalid") {
    return "rbac";
  }
  if (error_type === "jwt required") {
    return "auth";
  }
  if (error_type === "jwt invalid") {
    return "auth";
  }
  if (error_type === "timestamp required") {
    return "dto";
  }
  if (error_type === "dto invalid") {
    return "dto";
  }
  if (error_type === "lifecycle transition invalid") {
    return "lifecycle";
  }
  if (error_type === "lifecycle kind mismatch") {
    return "lifecycle";
  }
  if (error_type === "lifecycle state mismatch") {
    return "lifecycle";
  }
  if (error_type === "lifecycle postcondition failed") {
    return "lifecycle";
  }
  if (error_type === "entity_id required") {
    return "lifecycle";
  }
  if (error_type === "entity_id mismatch") {
    return "lifecycle";
  }
  if (error_type === "state required") {
    return "lifecycle";
  }
  if (error_type === "rule unknown") {
    return "rule";
  }
  if (error_type === "rule_id required") {
    return "rule";
  }
  if (error_type === "dynamic rule forbidden") {
    return "rule";
  }
  if (error_type === "event_id required") {
    return "event";
  }
  if (error_type === "event_type required") {
    return "event";
  }
  if (error_type === "event_type invalid") {
    return "event";
  }
  if (error_type === "event_source required") {
    return "event";
  }
  if (error_type === "event_category mismatch") {
    return "event";
  }
  if (error_type === "event payload invalid") {
    return "event";
  }
  if (error_type === "replay modified") {
    return "event";
  }
  if (error_type === "prepared statement required") {
    return "database";
  }
  if (error_type === "soft delete required") {
    return "database";
  }
  if (error_type === "database config required") {
    return "database";
  }
  if (error_type === "connection pool exhausted") {
    return "database";
  }
  throw new Error("event_type invalid");
}

export function createError(error_type: ErrorType, context: ErrorContext): CoreError {
  if (context.tenant_id === "") {
    throw new Error("tenant_id required");
  }
  const error: CoreError = {
    category: categoryForErrorType(error_type),
    error_type,
    tenant_id: context.tenant_id,
    user_id: context.user_id,
    role: context.role,
    timestamp: context.timestamp,
    correlation_id: context.correlation_id,
  };
  return Object.freeze(error);
}
