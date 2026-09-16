/**
 * AIMI Routing Engine
 * Master Blueprint V2 / BACKEND-STRUCTURE §6 / AIMI-ROUTING
 * Factory only. No Nest runtime. No global routing instance.
 */

import {
  RoutingEngineService,
  type RoutingEngineServiceOptions,
} from "./routing-engine.service";

export class RoutingEngineModule {
  static create(options: RoutingEngineServiceOptions): RoutingEngineService {
    return new RoutingEngineService(options);
  }
}

export { RoutingEngineService } from "./routing-engine.service";
export type { RoutingEngineServiceOptions } from "./routing-engine.service";
export type {
  BayCandidate,
  RoutingInputs,
  TechnicianCandidate,
  TechnicianSpeed,
} from "./routing-inputs.interface";
export type { RoutingOutput } from "./routing-output.interface";
export { freezeRoutingOutput } from "./routing-output.interface";
export type { RoutingMatch } from "./routing-decision-tree";
export { evaluateRoutingTree } from "./routing-decision-tree";
export {
  doesRoutingOverrideReduceSafety,
  isBayEligible,
  isRoleAllowedToOverrideRouting,
  isRoleAllowedToRoute,
  isSpeedEligible,
  isTechnicianEligible,
} from "./routing-rules";
export {
  incomingEventFromRouting,
  incomingEventFromRoutingOverride,
} from "./routing-events";
