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

export type WorkorderRiskLevel = 'low' | 'medium' | 'high' | 'unknown';

export type WorkorderHandlingRecommendationInput = {
  workorderId?: string;
  predictedEffortScore?: number | null;
  predictedDurationMinutes?: number | null;
  riskLevel?: WorkorderRiskLevel;
};

export type WorkorderFusion = {
  highRiskHighEffort: boolean;
  mediumRiskLongDuration: boolean;
  combinedRecommendation: boolean;
};

export type WorkorderHandlingRecommendationResult = {
  workorderId: string;
  technicianSkillRecommendation: 'senior' | 'intermediate' | 'junior';
  partsReadinessRecommendation:
    | 'pre-stage critical parts'
    | 'verify parts availability'
    | 'standard parts flow';
  preemptivePartsCheck: boolean;
  workorderFusion: WorkorderFusion;
};

export function recommendWorkorderHandling(
  input: WorkorderHandlingRecommendationInput,
): WorkorderHandlingRecommendationResult {
  // TODO: refine handling recommendations (certifications, OEM procedures). Do not create workorders.

  let technicianSkillRecommendation: 'senior' | 'intermediate' | 'junior' = 'junior';
  let partsReadinessRecommendation:
    | 'pre-stage critical parts'
    | 'verify parts availability'
    | 'standard parts flow' = 'standard parts flow';

  if (input.predictedEffortScore !== undefined) {
    if (input.predictedEffortScore !== null) {
      if (input.predictedEffortScore >= 3) {
        technicianSkillRecommendation = 'intermediate';
      }
      if (input.predictedEffortScore >= 5) {
        technicianSkillRecommendation = 'senior';
      }
    }
  }

  if (input.riskLevel === 'medium') {
    if (technicianSkillRecommendation === 'junior') {
      technicianSkillRecommendation = 'intermediate';
    }
    partsReadinessRecommendation = 'verify parts availability';
  }
  if (input.riskLevel === 'high') {
    technicianSkillRecommendation = 'senior';
    partsReadinessRecommendation = 'pre-stage critical parts';
  }

  let preemptivePartsCheck = false;
  if (input.riskLevel === 'high') {
    preemptivePartsCheck = true;
  }

  let highRiskHighEffort = false;
  if (input.riskLevel === 'high') {
    if (input.predictedEffortScore !== undefined) {
      if (input.predictedEffortScore !== null) {
        if (input.predictedEffortScore >= 5) {
          highRiskHighEffort = true;
        }
      }
    }
  }

  let mediumRiskLongDuration = false;
  if (input.riskLevel === 'medium') {
    if (input.predictedDurationMinutes !== undefined) {
      if (input.predictedDurationMinutes !== null) {
        if (input.predictedDurationMinutes >= 240) {
          mediumRiskLongDuration = true;
        }
      }
    }
  }

  let combinedRecommendation = false;
  if (highRiskHighEffort) {
    combinedRecommendation = true;
  }
  if (mediumRiskLongDuration) {
    combinedRecommendation = true;
  }

  const output: WorkorderHandlingRecommendationResult = {
    workorderId: asLabel(input.workorderId),
    technicianSkillRecommendation,
    partsReadinessRecommendation,
    preemptivePartsCheck,
    workorderFusion: {
      highRiskHighEffort,
      mediumRiskLongDuration,
      combinedRecommendation,
    },
  };

  output.preemptivePartsCheck ??= false;
  output.workorderFusion ??= {
    highRiskHighEffort: false,
    mediumRiskLongDuration: false,
    combinedRecommendation: false,
  };

  return output;
}
