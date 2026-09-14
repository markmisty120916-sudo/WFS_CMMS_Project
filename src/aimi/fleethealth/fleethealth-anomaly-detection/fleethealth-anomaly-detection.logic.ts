/**
 * AIMI Engine — Fleethealth Anomaly Detection
 * WFS Universal CMMS
 * Phase 2 diagnostic. Structural checks only.
 */

export type FleetHealthAnomalyInput = {
  recordId?: string;
  vehicleId?: string;
  healthStatus?: string;
  healthScore?: number;
};

export type FleetHealthAnomalyResult = {
  recordId: string;
  vehicleId: string;
  healthStatus: string;
  anomalyFlag: boolean;
};

function asLabel(value: string | undefined): string {
  if (value === undefined || value === '') {
    return 'unknown';
  }
  return value;
}

export function detectFleethealthAnomaly(input: FleetHealthAnomalyInput): FleetHealthAnomalyResult {
  // TODO: apply fleet-health domain anomaly rules (signal patterns, component thresholds).

  let anomalyFlag = false;

  if (input.recordId === undefined || input.recordId === '') {
    anomalyFlag = true;
  }
  if (input.vehicleId === undefined || input.vehicleId === '') {
    anomalyFlag = true;
  }
  if (input.healthStatus === undefined || input.healthStatus === '') {
    anomalyFlag = true;
  }
  if (input.healthScore !== undefined) {
    if (input.healthScore < 0) {
      anomalyFlag = true;
    }
    if (input.healthScore > 100) {
      anomalyFlag = true;
    }
  }

  return {
    recordId: asLabel(input.recordId),
    vehicleId: asLabel(input.vehicleId),
    healthStatus: asLabel(input.healthStatus),
    anomalyFlag,
  };
}
