/**
 * AIMI Scheduling Engine
 * Master Blueprint V2 / BACKEND-STRUCTURE §6 / AIMI-SCHEDULING
 * Factory only. No Nest runtime. No global scheduling instance.
 */

import {
  SchedulingEngineService,
  type SchedulingEngineServiceOptions,
} from "./scheduling-engine.service";

export class SchedulingEngineModule {
  static create(options: SchedulingEngineServiceOptions): SchedulingEngineService {
    return new SchedulingEngineService(options);
  }
}

export { SchedulingEngineService } from "./scheduling-engine.service";
export type { SchedulingEngineServiceOptions } from "./scheduling-engine.service";
export type {
  PredictiveSchedulingLevel,
  PmSchedulingLevel,
  SchedulingAsset,
  SchedulingBay,
  SchedulingInputs,
  SchedulingTechnician,
  SchedulingWindow,
  SchedulingWindowSlot,
} from "./scheduling-inputs.interface";
export type { SchedulingOutput } from "./scheduling-output.interface";
export { freezeSchedulingOutput } from "./scheduling-output.interface";
export type { SchedulingMatch } from "./scheduling-decision-tree";
export { evaluateSchedulingTree } from "./scheduling-decision-tree";
export {
  doesSchedulingOverrideReduceSafety,
  earlierWindow,
  escalateWindow,
  findWindowSlot,
  findWindowSlotByBounds,
  isAssetEligibleForScheduling,
  isBayEligibleForScheduling,
  isRoleAllowedToOverrideScheduling,
  isRoleAllowedToSchedule,
  isSchedulingSpeedEligible,
  isTechnicianAvailable,
  isTechnicianEligibleForScheduling,
  reasonFromSeverity,
  windowFromSeverity,
  windowRank,
} from "./scheduling-rules";
export {
  incomingEventFromScheduling,
  incomingEventFromSchedulingOverride,
} from "./scheduling-events";
