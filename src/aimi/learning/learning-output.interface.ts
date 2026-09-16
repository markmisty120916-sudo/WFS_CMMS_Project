/**
 * AIMI Learning Engine
 * Master Blueprint V2 / AIMI-LEARNING §8 / RBAC § no learning-weight mutation
 * Immutable insight output. Weights are copied frozen and never rewritten.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type {
  LearningApprovalStatus,
  LearningImpactArea,
  LearningInputs,
  LearningInsightType,
  LearningWeight,
} from "./learning-inputs.interface";

export type LearningOutput = {
  readonly learning_insight_id: string;
  readonly insight_type: LearningInsightType;
  readonly insight_summary: string;
  readonly recommended_action: string;
  readonly impact_area: LearningImpactArea;
  readonly approval_status: LearningApprovalStatus;
  readonly approval_reason: string;
  readonly learning_inputs: LearningInputs;
  readonly learning_weights: readonly LearningWeight[];
  readonly learning_timestamp: string;
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
};

function freezeWeight(weight: LearningWeight): LearningWeight {
  return Object.freeze({
    weight_id: weight.weight_id,
    tenant_id: weight.tenant_id,
    key: weight.key,
    value: weight.value,
  });
}

export function freezeLearningWeights(weights: readonly LearningWeight[]): readonly LearningWeight[] {
  const frozen: LearningWeight[] = [];
  let index = 0;
  while (index < weights.length) {
    frozen.push(freezeWeight(weights[index]));
    index = index + 1;
  }
  return Object.freeze(frozen);
}

export function freezeLearningOutput(output: LearningOutput): LearningOutput {
  return Object.freeze({
    learning_insight_id: output.learning_insight_id,
    insight_type: output.insight_type,
    insight_summary: output.insight_summary,
    recommended_action: output.recommended_action,
    impact_area: output.impact_area,
    approval_status: output.approval_status,
    approval_reason: output.approval_reason,
    learning_inputs: output.learning_inputs,
    learning_weights: freezeLearningWeights(output.learning_weights),
    learning_timestamp: output.learning_timestamp,
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
  });
}
