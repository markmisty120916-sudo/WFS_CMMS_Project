/**
 * AIMI Context Layer
 * Master Blueprint V2 / aimi.md §2 / RBAC / TENANT-ISOLATION
 * Engine slots follow Core routing and engine role rules. No context bypass.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type { ErrorType } from "../../core/errors/error-types";
import { isRoleAllowedForKind } from "../../core/lifecycle-engine/lifecycle-guards";
import type { LifecycleKind } from "../../core/lifecycle-engine/lifecycle-state.interface";
import type { LifecycleSnapshot } from "../../core/lifecycle-engine/lifecycle-snapshot";
import type { AimiEngineName } from "../core/aimi-core-engine-map";
import { isEngineAllowedForRole } from "../core/aimi-core-rules";

export type TenantScoped = {
  readonly tenant_id: string;
};

export function containsEngine(
  engines: readonly AimiEngineName[],
  name: AimiEngineName,
): boolean {
  let index = 0;
  while (index < engines.length) {
    if (engines[index] === name) {
      return true;
    }
    index = index + 1;
  }
  return false;
}

export function tenantMatches(tenant_id: string, scoped: TenantScoped | null): boolean {
  if (scoped === null) {
    return true;
  }
  if (scoped.tenant_id === tenant_id) {
    return true;
  }
  return false;
}

export function selectEngineInput<T extends TenantScoped>(
  engine: AimiEngineName,
  mapped: readonly AimiEngineName[],
  role: DtoRole,
  tenant_id: string,
  input: T | null,
): { error_code: ErrorType | "none"; value: T | null } {
  if (input === null) {
    return { error_code: "none", value: null };
  }
  if (input.tenant_id !== tenant_id) {
    return { error_code: "tenant_id mismatch", value: null };
  }
  if (containsEngine(mapped, engine) === false) {
    return { error_code: "dto invalid", value: null };
  }
  if (isEngineAllowedForRole(engine, role) === false) {
    return { error_code: "role unauthorized", value: null };
  }
  return { error_code: "none", value: input };
}

export function selectPrior<T extends TenantScoped>(
  tenant_id: string,
  prior: T | null,
): { error_code: ErrorType | "none"; value: T | null } {
  if (prior === null) {
    return { error_code: "none", value: null };
  }
  if (prior.tenant_id !== tenant_id) {
    return { error_code: "tenant_id mismatch", value: null };
  }
  return { error_code: "none", value: prior };
}

export function selectSnapshot(
  tenant_id: string,
  role: DtoRole,
  expected_kind: LifecycleKind,
  snapshot: LifecycleSnapshot | null,
): { error_code: ErrorType | "none"; value: LifecycleSnapshot | null } {
  if (snapshot === null) {
    return { error_code: "none", value: null };
  }
  if (snapshot.tenant_id !== tenant_id) {
    return { error_code: "tenant_id mismatch", value: null };
  }
  if (snapshot.kind !== expected_kind) {
    return { error_code: "lifecycle kind mismatch", value: null };
  }
  if (isRoleAllowedForKind(expected_kind, role) === false) {
    return { error_code: "role unauthorized", value: null };
  }
  return { error_code: "none", value: snapshot };
}
