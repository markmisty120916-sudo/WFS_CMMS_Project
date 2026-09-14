/**
 * AIMI Engine — Workorder Prioritization
 * WFS Universal CMMS
 * Phase 2 severity. Structural mapping only.
 */

export type WorkorderPriority = 'low' | 'medium' | 'high' | 'unknown';

export type WorkorderPrioritizationInput = {
  workorderId?: string;
  priority?: string;
  status?: string;
};

export type WorkorderPrioritizationResult = {
  workorderId: string;
  status: string;
  priority: WorkorderPriority;
};

function asLabel(value: string | undefined): string {
  if (value === undefined || value === '') {
    return 'unknown';
  }
  return value;
}

function asPriority(value: string | undefined): WorkorderPriority {
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

export function prioritizeWorkorder(
  input: WorkorderPrioritizationInput,
): WorkorderPrioritizationResult {
  // TODO: apply work-order domain priority rules (SLA, safety, fleet-health severity).

  return {
    workorderId: asLabel(input.workorderId),
    status: asLabel(input.status),
    priority: asPriority(input.priority),
  };
}
