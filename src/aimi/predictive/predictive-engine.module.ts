/**
 * AIMI Predictive Engine
 * Master Blueprint V2 / BACKEND-STRUCTURE §6 / AIMI-PREDICTIVE
 * Factory only. No Nest runtime. No global predictive instance.
 */

import {
  PredictiveEngineService,
  type PredictiveEngineServiceOptions,
} from "./predictive-engine.service";

export class PredictiveEngineModule {
  static create(options: PredictiveEngineServiceOptions): PredictiveEngineService {
    return new PredictiveEngineService(options);
  }
}

export { PredictiveEngineService } from "./predictive-engine.service";
export type { PredictiveEngineServiceOptions } from "./predictive-engine.service";
export type {
  AssetHealthLevel,
  DiagnosticHistoryLevel,
  FailureRisk,
  PredictiveInputs,
  PredictivePmLevel,
  TechnicianNotePredictiveLevel,
  TelematicsClusterLevel,
  UsagePatternLevel,
} from "./predictive-inputs.interface";
export type { PredictiveOutput } from "./predictive-output.interface";
export { freezePredictiveOutput } from "./predictive-output.interface";
export type { PredictiveMatch } from "./predictive-decision-tree";
export { evaluatePredictiveTree } from "./predictive-decision-tree";
export {
  doesPredictiveOverrideReduceSafety,
  failureRiskRank,
  isHigherFailureRisk,
  isRoleAllowedToForecast,
  isRoleAllowedToOverridePredictive,
  scoreForFailureRisk,
} from "./predictive-rules";
export {
  incomingEventFromPredictiveEscalated,
  incomingEventFromPredictiveGenerated,
  incomingEventFromPredictiveUpdated,
} from "./predictive-events";
