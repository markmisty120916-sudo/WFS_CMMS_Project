/**
 * AIMI Engine — Event Severity
 * WFS Universal CMMS
 * Scaffold only. No business logic.
 */

export interface EventSeverity {
  id: string;
  code: string;
  label: string;
  description?: string;
  level: number;
}

export interface EventSeverityAggregationResult {
  eventId: string;
  aggregatedSeverityLevel: number;
}

export interface EventSeverityClassificationResult {
  eventId: string;
  classificationCode: string;
}
