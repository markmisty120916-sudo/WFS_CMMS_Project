/**
 * LifecycleEngine — Core
 * Master Blueprint V2 / WORKORDER-LIFECYCLE / cursor-instructions §10
 * A transition is from_state → to_state within one kind only.
 */

import type { LifecycleKind, LifecycleState } from "./lifecycle-state.interface";

export type LifecycleTransition = {
  kind: LifecycleKind;
  from_state: LifecycleState;
  to_state: LifecycleState;
};
