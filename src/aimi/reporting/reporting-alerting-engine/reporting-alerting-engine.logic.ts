/**
 * AIMI Engine — Reporting Alerting Engine
 * WFS Universal CMMS
 * Phase 6 visibility plus prediction aggregates. Flags only.
 */

export type ReportingPredictionSummary = {
  highSeverity?: number;
  delays?: number;
  failureWindows?: number;
  longDurations?: number;
  capacityLow?: number;
};

export type ReportingAlertingInput = {
  reportId?: string;
  highSeverityCount?: number;
  totalCount?: number;
  highRiskWorkorderCount?: number;
  highProjectedSeverityCount?: number;
  slotsWithPredictedDelayCount?: number;
  predictionSummary?: ReportingPredictionSummary;
};

export type ReportingAlertCategory = 'risk_severity' | 'risk_schedule' | 'none';

export type ReportingAlertingResult = {
  reportId: string;
  alertFlag: boolean;
  alertCategory: ReportingAlertCategory;
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

export function generateReportingAlerts(input: ReportingAlertingInput): ReportingAlertingResult {
  // TODO: apply multi-signal alert rules (tenant thresholds, mute windows, combined forecasts).

  let alertFlag = false;
  let alertCategory: ReportingAlertCategory = 'none';

  if (input.predictionSummary !== undefined) {
    if (asCount(input.predictionSummary.delays) > 0) {
      alertCategory = 'risk_schedule';
    }
    if (asCount(input.predictionSummary.highSeverity) > 0) {
      alertFlag = true;
      alertCategory = 'risk_severity';
    }
    if (asCount(input.predictionSummary.delays) > 0) {
      if (asCount(input.predictionSummary.capacityLow) > 0) {
        alertFlag = true;
      }
    }
  }

  return {
    reportId: asLabel(input.reportId),
    alertFlag,
    alertCategory,
  };
}
