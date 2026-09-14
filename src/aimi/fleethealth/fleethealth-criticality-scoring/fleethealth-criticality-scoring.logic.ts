/**
 * AIMI Engine — Fleethealth Criticality Scoring
 * WFS Universal CMMS
 * Phase 2 severity. Structural mapping only.
 */

export type FleetHealthSeverity = 'low' | 'medium' | 'high' | 'unknown';

export type FleetHealthCriticalityInput = {
  recordId?: string;
  vehicleId?: string;
  anomalyFlag?: boolean;
  severity?: string;
};

export type FleetHealthCriticalityResult = {
  recordId: string;
  vehicleId: string;
  severity: FleetHealthSeverity;
};

function asLabel(value: string | undefined): string {
  if (value === undefined || value === '') {
    return 'unknown';
  }
  return value;
}

function asSeverity(value: string | undefined): FleetHealthSeverity {
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

export function scoreFleethealthCriticality(
  input: FleetHealthCriticalityInput,
): FleetHealthCriticalityResult {
  // TODO: apply fleet-health domain scoring rules (weights, component criticality).

  let severity: FleetHealthSeverity = 'unknown';

  if (input.anomalyFlag === true) {
    severity = 'high';
  }
  if (input.anomalyFlag !== true) {
    severity = asSeverity(input.severity);
  }

  return {
    recordId: asLabel(input.recordId),
    vehicleId: asLabel(input.vehicleId),
    severity,
  };
}
