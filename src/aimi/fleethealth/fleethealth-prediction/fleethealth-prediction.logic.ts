/**
 * AIMI Engine — Fleethealth Prediction
 * WFS Universal CMMS
 * Phase P1 forecast. Projects existing severity only.
 */

export type FleetHealthProjectedSeverity = 'low' | 'medium' | 'high' | 'unknown';

export type FleetHealthSeverityProjectionInput = {
  recordId?: string;
  severity?: string;
  anomalyFlag?: boolean;
};

export type FleetHealthSeverityProjectionResult = {
  recordId: string;
  projectedSeverity: FleetHealthProjectedSeverity;
};

function asLabel(value: string | undefined): string {
  if (value === undefined || value === '') {
    return 'unknown';
  }
  return value;
}

function asSeverity(value: string | undefined): FleetHealthProjectedSeverity {
  if (value === 'low') {
    return 'low';
  }
  if (value === 'medium') {
    return 'medium';
  }
  if (value === 'high') {
    return 'high';
  }
  return 'unknown';
}

export function projectFleethealthSeverity(
  input: FleetHealthSeverityProjectionInput,
): FleetHealthSeverityProjectionResult {
  // TODO: apply trend-based severity projection (multi-event windows, component coupling).

  let projectedSeverity: FleetHealthProjectedSeverity = 'unknown';

  if (input.anomalyFlag === true) {
    projectedSeverity = 'high';
  }
  if (input.anomalyFlag !== true) {
    projectedSeverity = asSeverity(input.severity);
  }

  return {
    recordId: asLabel(input.recordId),
    projectedSeverity,
  };
}
