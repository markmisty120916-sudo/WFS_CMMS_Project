/**
 * AIMI Engine — Event Severity
 * WFS Universal CMMS
 * Scaffold only. No business logic.
 */

import {
  EventSeverity,
  EventSeverityAggregationResult,
  EventSeverityClassificationResult,
} from "./event-severity.types";

export interface EventSeverityRepositoryContract {
  saveSeverity(severity: EventSeverity): Promise<void>;
  getSeverityByCode(code: string): Promise<EventSeverity | null>;
}

export interface EventSeverityAggregationEngineContract {
  aggregateSeverityForEvent(eventId: string): Promise<EventSeverityAggregationResult>;
}

export interface EventSeverityClassificationEngineContract {
  classifySeverityForEvent(eventId: string): Promise<EventSeverityClassificationResult>;
}
