/**
 * Errors Layer — Core
 * Master Blueprint V2 / TENANT-ISOLATION §2 / RBAC §2
 * Tenant-aware and role-aware error context. Silent Master Key still requires tenant_id.
 */

import type { ResultRole } from "../results/result-context";

export type ErrorContext = {
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: ResultRole;
  readonly timestamp: string;
  readonly correlation_id: string;
};

export function freezeErrorContext(context: ErrorContext): ErrorContext {
  if (context.tenant_id === "") {
    throw new Error("tenant_id required");
  }
  if (context.user_id === "") {
    throw new Error("user_id required");
  }
  if (context.timestamp === "") {
    throw new Error("timestamp required");
  }
  return Object.freeze({
    tenant_id: context.tenant_id,
    user_id: context.user_id,
    role: context.role,
    timestamp: context.timestamp,
    correlation_id: context.correlation_id,
  });
}
