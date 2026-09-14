/**
 * AIMI Engine — Workorder Sla Evaluation
 * WFS Universal CMMS
 * Phase 4 operational evaluation. No persistence.
 */

export type WorkorderSlaStatus = 'on_track' | 'at_risk' | 'breached' | 'unknown';

export type WorkorderSLAInput = {
  workorderId?: string;
  now?: string | Date;
  ingestedAt?: string | Date;
  startedAt?: string | Date;
  slaDueAt?: string | Date;
};

export type WorkorderSLAEvaluation = {
  workorderId: string;
  slaStatus: WorkorderSlaStatus;
};

function asLabel(value: string | undefined): string {
  if (value === undefined || value === '') {
    return 'unknown';
  }
  return value;
}

function asTimeMs(value: string | Date | undefined): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value instanceof Date) {
    const ms = value.getTime();
    if (ms !== ms) {
      return undefined;
    }
    return ms;
  }
  if (value === '') {
    return undefined;
  }
  const parsed = Date.parse(value);
  if (parsed !== parsed) {
    return undefined;
  }
  return parsed;
}

export function evaluateWorkorderSLA(input: WorkorderSLAInput): WorkorderSLAEvaluation {
  // TODO: apply richer SLA rules (pause clocks, shop hours, severity-adjusted due times).

  const workorderId = asLabel(input.workorderId);
  const nowMs = asTimeMs(input.now);
  const dueMs = asTimeMs(input.slaDueAt);
  const startMs = asTimeMs(input.startedAt);
  const ingestedMs = asTimeMs(input.ingestedAt);

  if (nowMs === undefined) {
    return { workorderId, slaStatus: 'unknown' };
  }
  if (dueMs === undefined) {
    return { workorderId, slaStatus: 'unknown' };
  }
  if (nowMs > dueMs) {
    return { workorderId, slaStatus: 'breached' };
  }

  let originMs = ingestedMs;
  if (originMs === undefined) {
    originMs = startMs;
  }
  if (originMs === undefined) {
    return { workorderId, slaStatus: 'on_track' };
  }

  const totalMs = dueMs - originMs;
  if (totalMs <= 0) {
    return { workorderId, slaStatus: 'unknown' };
  }

  const elapsedMs = nowMs - originMs;
  if (elapsedMs * 4 >= totalMs * 3) {
    return { workorderId, slaStatus: 'at_risk' };
  }

  return { workorderId, slaStatus: 'on_track' };
}
