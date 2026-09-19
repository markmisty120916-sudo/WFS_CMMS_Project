/**
 * AIMI Predictive Engine
 * Master Blueprint V2 / AIMI-PREDICTIVE §8
 * Immutable predictive output. All required fields present.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type { FailureRisk, PredictiveInputs } from "./predictive-inputs.interface";

export type PredictiveOutput = {
  readonly predictive_score: number;
  readonly failure_risk: FailureRisk;
  readonly predictive_reason: string;
  readonly predictive_inputs: PredictiveInputs;
  readonly predictive_timestamp: string;
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
};

export function freezePredictiveOutput(output: PredictiveOutput): PredictiveOutput {
  return Object.freeze({
    predictive_score: output.predictive_score,
    failure_risk: output.failure_risk,
    predictive_reason: output.predictive_reason,
    predictive_inputs: output.predictive_inputs,
    predictive_timestamp: output.predictive_timestamp,
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
  });
}
