/**
 * AIMI Engine — Event Severity
 * WFS Universal CMMS
 * Scaffold only. No business logic.
 */

import {
  EventSeverityAggregationEngineContract,
  EventSeverityClassificationEngineContract,
} from "./event-severity.contract";

import {
  EventSeverityAggregationResult,
  EventSeverityClassificationResult,
} from "./event-severity.types";

export class EventSeverityService {
  constructor(
    private readonly aggregationEngine: EventSeverityAggregationEngineContract,
    private readonly classificationEngine: EventSeverityClassificationEngineContract,
  ) {}

  async aggregateEventSeverity(eventId: string): Promise<EventSeverityAggregationResult> {
    // scaffold only
    return this.aggregationEngine.aggregateSeverityForEvent(eventId);
  }

  async classifyEventSeverity(eventId: string): Promise<EventSeverityClassificationResult> {
    // scaffold only
    return this.classificationEngine.classifySeverityForEvent(eventId);
  }
}
