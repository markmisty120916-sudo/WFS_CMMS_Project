/**
 * AIMI Engine — Workorder Recommendation
 * WFS Universal CMMS
 * Phase P2 forecast. Deterministic effort mapping only.
 */

export type WorkorderEffortEstimationInput = {
  workorderId?: string;
  complexity?: string;
};

export type WorkorderEffortEstimationResult = {
  workorderId: string;
  predictedEffortScore: number | null;
};

function asLabel(value: string | undefined): string {
  if (value === undefined || value === '') {
    return 'unknown';
  }
  return value;
}

export function estimateWorkorderEffort(
  input: WorkorderEffortEstimationInput,
): WorkorderEffortEstimationResult {
  // TODO: apply multi-factor effort estimation (skills, parts, vehicle class).

  const workorderId = asLabel(input.workorderId);
  let predictedEffortScore: number | null = null;

  if (input.complexity === undefined || input.complexity === '') {
    return { workorderId, predictedEffortScore: null };
  }

  if (input.complexity === 'low') {
    predictedEffortScore = 1;
  }
  if (input.complexity === 'medium') {
    predictedEffortScore = 3;
  }
  if (input.complexity === 'high') {
    predictedEffortScore = 5;
  }

  return {
    workorderId,
    predictedEffortScore,
  };
}
