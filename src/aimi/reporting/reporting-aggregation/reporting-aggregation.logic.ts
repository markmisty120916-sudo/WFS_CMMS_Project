/**
 * AIMI Engine — Reporting Aggregation
 * WFS Universal CMMS
 * Phase 6 visibility. Roll-up of existing counts only.
 */

export type ReportingAggregationInput = {
  reportId?: string;
  highSeverityCount?: number;
  mediumSeverityCount?: number;
  lowSeverityCount?: number;
  unknownSeverityCount?: number;
};

export type ReportingAggregationResult = {
  reportId: string;
  highSeverityCount: number;
  mediumSeverityCount: number;
  lowSeverityCount: number;
  unknownSeverityCount: number;
  totalCount: number;
  highSeverityPercent: number;
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
  // TODO: apply future aggregation rules (by shop, fleet, time window).

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

  return {
    reportId: asLabel(input.reportId),
    highSeverityCount,
    mediumSeverityCount,
    lowSeverityCount,
    unknownSeverityCount,
    totalCount,
    highSeverityPercent,
  };
}
