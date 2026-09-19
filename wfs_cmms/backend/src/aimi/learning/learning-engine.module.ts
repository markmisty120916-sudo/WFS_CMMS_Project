/**
 * AIMI Learning Engine
 * Master Blueprint V2 / BACKEND-STRUCTURE §6 / AIMI-LEARNING
 * Factory only. No Nest runtime. No global learning instance.
 */

import {
  LearningEngineService,
  type LearningEngineServiceOptions,
} from "./learning-engine.service";

export class LearningEngineModule {
  static create(options: LearningEngineServiceOptions): LearningEngineService {
    return new LearningEngineService(options);
  }
}

export { LearningEngineService } from "./learning-engine.service";
export type { LearningEngineServiceOptions } from "./learning-engine.service";
export type {
  CompletionBand,
  ComplianceBand,
  LearningApprovalStatus,
  LearningImpactArea,
  LearningInputs,
  LearningInsightType,
  LearningWeight,
  PatternBand,
  PerformanceBand,
  RepeatBand,
  ValidationBand,
  WorkflowSpeedLevel,
} from "./learning-inputs.interface";
export type { LearningOutput } from "./learning-output.interface";
export { freezeLearningOutput, freezeLearningWeights } from "./learning-output.interface";
export type { LearningMatch } from "./learning-update-tree";
export { evaluateLearningUpdateTree } from "./learning-update-tree";
export {
  actionForImpactArea,
  actionFromWorkflowSpeed,
  areWeightsImmutable,
  impactAreaForFleet,
  isRoleAllowedToApproveLearning,
  isRoleAllowedToGenerateLearning,
  slowerWorkflowSpeed,
  speedFromCompletion,
  speedFromCompliance,
  speedFromPerformance,
  speedFromRepeat,
  speedFromValidation,
  weightsAreTenantScoped,
  workflowSpeedRank,
} from "./learning-rules";
export {
  incomingEventFromLearningApplied,
  incomingEventFromLearningApproved,
  incomingEventFromLearningGenerated,
} from "./learning-events";
