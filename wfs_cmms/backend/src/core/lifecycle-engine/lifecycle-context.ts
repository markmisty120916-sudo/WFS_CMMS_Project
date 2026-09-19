/**
 * LifecycleEngine — Core
 * Master Blueprint V2 / TENANT-ISOLATION §2 / RBAC §2
 * Tenant-aware and role-aware lifecycle context.
 */

import type { LifecycleKind, LifecycleRole, LifecycleState } from "./lifecycle-state.interface";

export type LifecycleContext = {
  tenant_id: string;
  user_id: string;
  role: LifecycleRole;
  kind: LifecycleKind;
  entity_id: string;
  state: LifecycleState;
  timestamp: string;
};
