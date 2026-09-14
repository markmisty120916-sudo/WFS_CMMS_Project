/**
 * AIMI Engine — Workorder Prediction
 * WFS Universal CMMS
 * Phase P2 forecast. Deterministic duration heuristics only.
 */

export type WorkorderDurationForecastInput = {
  workorderId?: string;
  category?: string;
};

export type WorkorderDurationForecastResult = {
  workorderId: string;
  predictedDurationMinutes: number | null;
};

function asLabel(value: string | undefined): string {
  if (value === undefined || value === '') {
    return 'unknown';
  }
  return value;
}

export function forecastWorkorderDuration(
  input: WorkorderDurationForecastInput,
): WorkorderDurationForecastResult {
  // TODO: apply statistical/ML duration models (job history, shop load, parts wait).

  const workorderId = asLabel(input.workorderId);
  let predictedDurationMinutes: number | null = null;

  if (input.category === undefined || input.category === '') {
    return { workorderId, predictedDurationMinutes: null };
  }

  if (input.category === 'inspection') {
    predictedDurationMinutes = 45;
  }
  if (input.category === 'repair') {
    predictedDurationMinutes = 180;
  }
  if (input.category === 'major_repair') {
    predictedDurationMinutes = 360;
  }

  return {
    workorderId,
    predictedDurationMinutes,
  };
}
