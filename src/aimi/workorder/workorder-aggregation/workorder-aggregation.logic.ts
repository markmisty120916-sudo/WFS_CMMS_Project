/**
 * AIMI Engine — Workorder Aggregation
 * WFS Universal CMMS
 * Phase P2 forecast. Risk from existing SLA window and duration only.
 */

export type WorkorderRiskLevel = 'low' | 'medium' | 'high' | 'unknown';

export type WorkorderRiskProjectionInput = {
  workorderId?: string;
  slaWindow?: string;
  predictedDurationMinutes?: number | null;
};

export type WorkorderRiskProjectionResult = {
  workorderId: string;
  riskLevel: WorkorderRiskLevel;
};

function asLabel(value: string | undefined): string {
  if (value === undefined || value === '') {
    return 'unknown';
  }
  return value;
}

export function projectWorkorderRisk(input: WorkorderRiskProjectionInput): WorkorderRiskProjectionResult {
  // TODO: apply future risk scoring models (parts delay, technician load, repeat failures).

  const workorderId = asLabel(input.workorderId);

  if (input.slaWindow === undefined || input.slaWindow === '') {
    return { workorderId, riskLevel: 'unknown' };
  }
  if (input.predictedDurationMinutes === undefined || input.predictedDurationMinutes === null) {
    return { workorderId, riskLevel: 'unknown' };
  }

  let riskLevel: WorkorderRiskLevel = 'low';

  if (input.slaWindow === 'moderate') {
    if (input.predictedDurationMinutes >= 120) {
      if (input.predictedDurationMinutes < 240) {
        riskLevel = 'medium';
      }
    }
  }

  if (input.slaWindow === 'tight') {
    if (input.predictedDurationMinutes >= 240) {
      riskLevel = 'high';
    }
  }

  return {
    workorderId,
    riskLevel,
  };
}
