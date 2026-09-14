/**
 * AIMI Engine — Reporting Alerting Engine
 * WFS Universal CMMS
 * Phase 6 visibility. Flags from existing aggregates only.
 */

export type ReportingAlertingInput = {
  reportId?: string;
  highSeverityCount?: number;
  totalCount?: number;
};

export type ReportingAlertingResult = {
  reportId: string;
  alertFlag: boolean;
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
  // TODO: apply future alerting rules (thresholds by tenant, mute windows).

  let alertFlag = false;

  if (asCount(input.highSeverityCount) > 0) {
    alertFlag = true;
  }

  return {
    reportId: asLabel(input.reportId),
    alertFlag,
  };
}
