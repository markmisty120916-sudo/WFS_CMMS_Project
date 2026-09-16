/**
 * Validation Layer — Core
 * Master Blueprint V2 / TENANT-ISOLATION §2 / cursor-instructions §10
 * Zod-style context schema. Integrates Logger, Rule Engine, and Lifecycle Engine shapes.
 */

import { freezeContextDto, type ContextDto } from "../dto/context.dto";
import { isRoleAllowedForKind, isTransitionAllowed } from "../lifecycle-engine/lifecycle-guards";
import type { LifecycleKind } from "../lifecycle-engine/lifecycle-state.interface";
import type { LoggerContext } from "../logger/logger-context";
import type { RuleContext } from "../rule-engine/rule-context";
import { asRecord, asString, createValidationResult, type ValidationResult } from "./dto.schema";
import { parseDtoRole } from "./role.schema";

function parseLifecycleKind(value: unknown): LifecycleKind | "" | null {
  if (value === "") {
    return "";
  }
  if (value === "workorder") {
    return "workorder";
  }
  if (value === "pm") {
    return "pm";
  }
  if (value === "compliance") {
    return "compliance";
  }
  if (value === "inventory") {
    return "inventory";
  }
  if (value === "diagnostic") {
    return "diagnostic";
  }
  if (value === "scheduling") {
    return "scheduling";
  }
  if (value === "routing") {
    return "routing";
  }
  return null;
}

export function toLoggerContext(dto: ContextDto): LoggerContext {
  return {
    tenant_id: dto.tenant_id,
    user_id: dto.user_id,
    role: dto.role,
    correlation_id: dto.correlation_id,
    timestamp: dto.timestamp,
  };
}

export function toRuleContext(dto: ContextDto): RuleContext {
  return {
    tenant_id: dto.tenant_id,
    user_id: dto.user_id,
    role: dto.role,
    rule_id: dto.rule_id,
    timestamp: dto.timestamp,
    lifecycle_kind: dto.lifecycle_kind,
    from_state: dto.from_state,
    to_state: dto.to_state,
    entity_id: dto.entity_id,
  };
}

export const contextSchema = {
  safeParse(input: unknown, engine_tenant_id: string): ValidationResult<ContextDto> {
    if (engine_tenant_id === "") {
      return createValidationResult(false, null, "tenant_id required");
    }
    const record = asRecord(input);
    if (record === null) {
      return createValidationResult(false, null, "dto invalid");
    }
    const tenant_id = asString(record.tenant_id);
    if (tenant_id === "") {
      return createValidationResult(false, null, "tenant_id required");
    }
    if (tenant_id !== engine_tenant_id) {
      return createValidationResult(false, null, "tenant_id mismatch");
    }
    const timestamp = asString(record.timestamp);
    if (timestamp === "") {
      return createValidationResult(false, null, "timestamp required");
    }
    const role = parseDtoRole(record.role);
    if (role === null) {
      return createValidationResult(false, null, "role invalid");
    }
    const user_id = asString(record.user_id);
    if (user_id === "") {
      return createValidationResult(false, null, "dto invalid");
    }
    const correlation_id = asString(record.correlation_id);
    if (correlation_id === "") {
      return createValidationResult(false, null, "dto invalid");
    }
    const lifecycle_kind = parseLifecycleKind(record.lifecycle_kind);
    if (lifecycle_kind === null) {
      return createValidationResult(false, null, "lifecycle transition invalid");
    }
    const from_state = asString(record.from_state);
    const to_state = asString(record.to_state);
    const entity_id = asString(record.entity_id);
    const rule_id = asString(record.rule_id);

    if (lifecycle_kind !== "") {
      if (isRoleAllowedForKind(lifecycle_kind, role) === false) {
        return createValidationResult(false, null, "role unauthorized");
      }
      if (to_state !== "") {
        if (isTransitionAllowed({
          kind: lifecycle_kind,
          from_state,
          to_state,
        }) === false) {
          return createValidationResult(false, null, "lifecycle transition invalid");
        }
      }
    }

    return createValidationResult(
      true,
      freezeContextDto(
        tenant_id,
        role,
        timestamp,
        user_id,
        correlation_id,
        rule_id,
        lifecycle_kind,
        from_state,
        to_state,
        entity_id,
      ),
      "none",
    );
  },
};
