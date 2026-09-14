/**
 * AIMI Engine — Reporting Alerting Engine
 * WFS Universal CMMS
 * Phase 6 visibility plus prediction aggregates. Flags only.
 */

export type ReportingAlertingInput = {
  reportId?: string;
  highSeverityCount?: number;
  totalCount?: number;
  highRiskWorkorderCount?: number;
  highProjectedSeverityCount?: number;
  slotsWithPredictedDelayCount?: number;
};

export type ReportingAlertingResult = {
  reportId: string;
  alertFlag: boolean;
};

const PREDICTED_DELAY_SLOT_THRESHOLD = 0;

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

  if (asCount(input.highSeverityCount) > 0) {
    alertFlag = true;
  }
  if (asCount(input.highProjectedSeverityCount) > 0) {
    alertFlag = true;
  }
  if (asCount(input.highRiskWorkorderCount) > 0) {
    alertFlag = true;
  }
  if (asCount(input.slotsWithPredictedDelayCount) > PREDICTED_DELAY_SLOT_THRESHOLD) {
    alertFlag = true;
  }

  return {
    reportId: asLabel(input.reportId),
    alertFlag,
  };
}
