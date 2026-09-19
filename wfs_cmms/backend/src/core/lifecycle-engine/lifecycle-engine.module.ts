/**
 * LifecycleEngine — Core
 * Master Blueprint V2 / BACKEND-STRUCTURE §4 / cursor-instructions §10
 * Factory only. No Nest runtime. No global state machine.
 */

import {
  LifecycleEngineService,
  type LifecycleEngineServiceOptions,
} from "./lifecycle-engine.service";

export class LifecycleEngineModule {
  static create(options: LifecycleEngineServiceOptions): LifecycleEngineService {
    return new LifecycleEngineService(options);
  }
}

export { LifecycleEngineService } from "./lifecycle-engine.service";
export type { LifecycleEngineServiceOptions } from "./lifecycle-engine.service";
export type { LifecycleContext } from "./lifecycle-context";
export type { LifecycleSnapshot } from "./lifecycle-snapshot";
export { createLifecycleSnapshot } from "./lifecycle-snapshot";
export type { LifecycleKind, LifecycleRole, LifecycleState } from "./lifecycle-state.interface";
export type { LifecycleTransition } from "./lifecycle-transition.interface";
export {
  assertInvariants,
  assertPostconditions,
  assertPreconditions,
  initialStateForKind,
  isRoleAllowedForKind,
  isTransitionAllowed,
} from "./lifecycle-guards";
export { eventTypeForSnapshot, incomingEventFromSnapshot } from "./lifecycle-events";
