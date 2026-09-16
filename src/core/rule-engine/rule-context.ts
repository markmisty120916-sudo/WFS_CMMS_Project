/**
 * RuleEngine — Core
 * Master Blueprint V2 / TENANT-ISOLATION §2 / RBAC §2
 * Tenant-aware and role-aware evaluation context.
 */

import type { LifecycleKind, LifecycleState } from "../lifecycle-engine/lifecycle-state.interface";
import type { RuleRole } from "./rule.interface";

export type RuleContext = {
  tenant_id: string;
  user_id: string;
  role: RuleRole;
  rule_id: string;
  timestamp: string;
  lifecycle_kind: LifecycleKind | "";
  from_state: LifecycleState;
  to_state: LifecycleState;
  entity_id: string;
};
