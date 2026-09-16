/**
 * LifecycleEngine — Core
 * Master Blueprint V2 / WORKORDER-LIFECYCLE §12
 * Immutable lifecycle snapshots. Timeline values are not rewritten.
 */

import type { LifecycleContext } from "./lifecycle-context";
import type { LifecycleKind, LifecycleRole, LifecycleState } from "./lifecycle-state.interface";

export type LifecycleSnapshot = {
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: LifecycleRole;
  readonly kind: LifecycleKind;
  readonly entity_id: string;
  readonly state: LifecycleState;
  readonly previous_state: LifecycleState;
  readonly timestamp: string;
};

export function createLifecycleSnapshot(
  context: LifecycleContext,
  previous_state: LifecycleState,
): LifecycleSnapshot {
  if (context.tenant_id === "") {
    throw new Error("tenant_id required");
  }
  if (context.user_id === "") {
    throw new Error("user_id required");
  }
  if (context.entity_id === "") {
    throw new Error("entity_id required");
  }
  if (context.state === "") {
    throw new Error("state required");
  }
  if (context.timestamp === "") {
    throw new Error("timestamp required");
  }

  const snapshot: LifecycleSnapshot = {
    tenant_id: context.tenant_id,
    user_id: context.user_id,
    role: context.role,
    kind: context.kind,
    entity_id: context.entity_id,
    state: context.state,
    previous_state,
    timestamp: context.timestamp,
  };

  return Object.freeze(snapshot);
}
