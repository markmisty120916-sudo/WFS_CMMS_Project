/**
 * Results Layer — Core
 * Master Blueprint V2 / TENANT-ISOLATION §2 / RBAC §2
 * Tenant-aware and role-aware result context for Logger, Rule, Lifecycle, EventBus.
 */

import type { LifecycleKind, LifecycleState } from "../lifecycle-engine/lifecycle-state.interface";
import type { LoggerContext } from "../logger/logger-context";
import type { RuleContext } from "../rule-engine/rule-context";

export type ResultRole =
  | "DRIVER"
  | "TECHNICIAN"
  | "MASTER TECHNICIAN"
  | "PARTS MANAGER"
  | "FLEET MANAGER"
  | "COMPLIANCE OFFICER"
  | "ADMIN"
  | "SILENT MASTER KEY";

export type ResultContext = {
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: ResultRole;
  readonly timestamp: string;
  readonly correlation_id: string;
  readonly rule_id: string;
  readonly lifecycle_kind: LifecycleKind | "";
  readonly from_state: LifecycleState;
  readonly to_state: LifecycleState;
  readonly entity_id: string;
};

export function freezeResultContext(context: ResultContext): ResultContext {
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
    rule_id: context.rule_id,
    lifecycle_kind: context.lifecycle_kind,
    from_state: context.from_state,
    to_state: context.to_state,
    entity_id: context.entity_id,
  });
}

export function toLoggerContext(context: ResultContext): LoggerContext {
  return {
    tenant_id: context.tenant_id,
    user_id: context.user_id,
    role: context.role,
    correlation_id: context.correlation_id,
    timestamp: context.timestamp,
  };
}

export function toRuleContext(context: ResultContext): RuleContext {
  return {
    tenant_id: context.tenant_id,
    user_id: context.user_id,
    role: context.role,
    rule_id: context.rule_id,
    timestamp: context.timestamp,
    lifecycle_kind: context.lifecycle_kind,
    from_state: context.from_state,
    to_state: context.to_state,
    entity_id: context.entity_id,
  };
}
