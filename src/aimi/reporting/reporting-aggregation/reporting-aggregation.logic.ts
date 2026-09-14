/**
 * AIMI Engine — Reporting Aggregation
 * WFS Universal CMMS
 * Phase 6 visibility plus prediction roll-ups. Existing metrics only.
 */

export type ReportingProjectedCapacity = 'high' | 'medium' | 'low' | 'unknown';

export type ReportingAggregationInput = {
  reportId?: string;
  highSeverityCount?: number;
  mediumSeverityCount?: number;
  lowSeverityCount?: number;
  unknownSeverityCount?: number;
  predictedFailureWindow?: number | null;
  predictedFailureWindowPresentCount?: number;
  predictedDurationMinutes?: number | null;
  predictedDurationMinutesSum?: number;
  predictedDurationMinutesCount?: number;
  predictedDelayMinutes?: number | null;
  projectedCapacity?: ReportingProjectedCapacity;
  highProjectedCapacityCount?: number;
};

export type ReportingAggregationResult = {
  reportId: string;
  highSeverityCount: number;
  mediumSeverityCount: number;
  lowSeverityCount: number;
  unknownSeverityCount: number;
  totalCount: number;
  highSeverityPercent: number;
  predictedFailureWindowPresentCount: number;
  averagePredictedDurationMinutes: number;
  predictedDelayMinutes: number;
  highProjectedCapacityCount: number;
};

function asCount(value: number | undefined): number {
  if (value === undefined) {
    return 0;
  }
  return value;
}

function asLabel(value: string | undefined): string {
  if (value === undefined || value === '') {
    return 'unknown';
  }
  return value;
}

export function aggregateReportingData(input: ReportingAggregationInput): ReportingAggregationResult {
  // TODO: add richer prediction-based reporting metrics (by shop, fleet, time window).

  const highSeverityCount = asCount(input.highSeverityCount);
  const mediumSeverityCount = asCount(input.mediumSeverityCount);
  const lowSeverityCount = asCount(input.lowSeverityCount);
  const unknownSeverityCount = asCount(input.unknownSeverityCount);
  const totalCount =
    highSeverityCount + mediumSeverityCount + lowSeverityCount + unknownSeverityCount;

  let highSeverityPercent = 0;
  if (totalCount > 0) {
    highSeverityPercent = (highSeverityCount * 100) / totalCount;
  }

  let predictedFailureWindowPresentCount = asCount(input.predictedFailureWindowPresentCount);
  if (input.predictedFailureWindowPresentCount === undefined) {
    if (input.predictedFailureWindow !== undefined) {
      if (input.predictedFailureWindow !== null) {
        predictedFailureWindowPresentCount = 1;
      }
    }
  }

  let durationSum = asCount(input.predictedDurationMinutesSum);
  let durationCount = asCount(input.predictedDurationMinutesCount);
  if (input.predictedDurationMinutesSum === undefined) {
    if (input.predictedDurationMinutes !== undefined) {
      if (input.predictedDurationMinutes !== null) {
        durationSum = input.predictedDurationMinutes;
        durationCount = 1;
      }
    }
  }

  let averagePredictedDurationMinutes = 0;
  if (durationCount > 0) {
    averagePredictedDurationMinutes = durationSum / durationCount;
  }

  let predictedDelayMinutes = asCount(
    input.predictedDelayMinutes === null ? undefined : input.predictedDelayMinutes,
  );

  let highProjectedCapacityCount = asCount(input.highProjectedCapacityCount);
  if (input.highProjectedCapacityCount === undefined) {
    if (input.projectedCapacity === 'high') {
      highProjectedCapacityCount = 1;
    }
  }

  return {
    reportId: asLabel(input.reportId),
    highSeverityCount,
    mediumSeverityCount,
    lowSeverityCount,
    unknownSeverityCount,
    totalCount,
    highSeverityPercent,
    predictedFailureWindowPresentCount,
    averagePredictedDurationMinutes,
    predictedDelayMinutes,
    highProjectedCapacityCount,
  };
}
