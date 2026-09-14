/**
 * AIMI Engine — Event Severity
 * WFS Universal CMMS
 * Scaffold only. No business logic.
 */

import { EventSeverityService } from "./event-severity.service";

import {
  EventSeverityAggregationResult,
  EventSeverityClassificationResult,
} from "./event-severity.types";

export class EventSeverityController {
  constructor(private readonly service: EventSeverityService) {}

  async aggregate(eventId: string): Promise<EventSeverityAggregationResult> {
    // scaffold only
    return this.service.aggregateEventSeverity(eventId);
  }

  async classify(eventId: string): Promise<EventSeverityClassificationResult> {
    // scaffold only
    return this.service.classifyEventSeverity(eventId);
  }
}
