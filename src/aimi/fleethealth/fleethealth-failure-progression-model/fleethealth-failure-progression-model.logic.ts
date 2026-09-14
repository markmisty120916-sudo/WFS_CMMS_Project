/**
 * AIMI Engine — Fleethealth Failure Progression Model
 * WFS Universal CMMS
 * Phase P1 forecast. Deterministic window heuristics only.
 */

export type FleetHealthFailureWindowInput = {
  recordId?: string;
  healthStatus?: string;
  lastEventAt?: string;
  mileage?: number;
  hours?: number;
  severity?: string;
};

export type FleetHealthFailureWindowResult = {
  recordId: string;
  predictedFailureWindowHours: number | null;
};

function asLabel(value: string | undefined): string {
  if (value === undefined || value === '') {
    return 'unknown';
  }
  return value;
}

function isMissingLabel(value: string | undefined): boolean {
  if (value === undefined || value === '') {
    return true;
  }
  return false;
}

export function predictFailureWindow(
  input: FleetHealthFailureWindowInput,
): FleetHealthFailureWindowResult {
  // TODO: apply statistical/ML failure-window rules (survival curves, component life).

  const recordId = asLabel(input.recordId);
  let predictedFailureWindowHours: number | null = null;

  if (isMissingLabel(input.lastEventAt)) {
    return { recordId, predictedFailureWindowHours: null };
  }
  if (isMissingLabel(input.healthStatus)) {
    return { recordId, predictedFailureWindowHours: null };
  }
  if (input.mileage === undefined) {
    return { recordId, predictedFailureWindowHours: null };
  }
  if (input.hours === undefined) {
    return { recordId, predictedFailureWindowHours: null };
  }

  if (input.severity === 'high') {
    predictedFailureWindowHours = 48;
  }
  if (input.severity === 'medium') {
    predictedFailureWindowHours = 168;
  }
  if (input.severity === 'low') {
    predictedFailureWindowHours = 720;
  }

  return {
    recordId,
    predictedFailureWindowHours,
  };
}
