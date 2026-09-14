/**
 * AIMI Engine — Fleethealth Aggregation
 * WFS Universal CMMS
 * Phase P1 forecast. Trend from existing severity values only.
 */

export type FleetHealthRecord = {
  severity: string;
  timestamp: string;
};

export type FleetHealthTrend = 'worsening' | 'improving' | 'stable' | 'unknown';

export type FleetHealthTrendResult = {
  trend: FleetHealthTrend;
};

function severityRank(severity: string): number {
  if (severity === 'low') {
    return 1;
  }
  if (severity === 'medium') {
    return 2;
  }
  if (severity === 'high') {
    return 3;
  }
  return 0;
}

export function analyzeFleethealthTrend(input: FleetHealthRecord[]): FleetHealthTrendResult {
  // TODO: apply multi-point statistical trend analysis (slopes, smoothing, sample windows).

  if (input.length < 2) {
    return { trend: 'unknown' };
  }

  let earliest = input[0];
  let latest = input[0];
  for (const record of input) {
    if (record.timestamp < earliest.timestamp) {
      earliest = record;
    }
    if (record.timestamp > latest.timestamp) {
      latest = record;
    }
  }

  if (earliest.timestamp === latest.timestamp) {
    if (earliest.severity === latest.severity) {
      return { trend: 'stable' };
    }
    return { trend: 'unknown' };
  }

  const startRank = severityRank(earliest.severity);
  const endRank = severityRank(latest.severity);

  if (endRank > startRank) {
    return { trend: 'worsening' };
  }
  if (endRank < startRank) {
    return { trend: 'improving' };
  }

  return { trend: 'stable' };
}
