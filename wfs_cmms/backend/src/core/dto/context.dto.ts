/**
 * DTO Layer — Core
 * Master Blueprint V2 / TENANT-ISOLATION §2
 * Immutable request context for Logger, Rule Engine, and Lifecycle Engine.
 */

import type { LifecycleKind, LifecycleState } from "../lifecycle-engine/lifecycle-state.interface";
import { freezeBaseDto, type BaseDto, type DtoRole } from "./base.dto";

export type ContextDto = BaseDto & {
  readonly user_id: string;
  readonly correlation_id: string;
  readonly rule_id: string;
  readonly lifecycle_kind: LifecycleKind | "";
  readonly from_state: LifecycleState;
  readonly to_state: LifecycleState;
  readonly entity_id: string;
};

export function freezeContextDto(
  tenant_id: string,
  role: DtoRole,
  timestamp: string,
  user_id: string,
  correlation_id: string,
  rule_id: string,
  lifecycle_kind: LifecycleKind | "",
  from_state: LifecycleState,
  to_state: LifecycleState,
  entity_id: string,
): ContextDto {
  const base = freezeBaseDto({
    tenant_id,
    role,
    timestamp,
  });
  return Object.freeze({
    tenant_id: base.tenant_id,
    role: base.role,
    timestamp: base.timestamp,
    user_id,
    correlation_id,
    rule_id,
    lifecycle_kind,
    from_state,
    to_state,
    entity_id,
  });
}
