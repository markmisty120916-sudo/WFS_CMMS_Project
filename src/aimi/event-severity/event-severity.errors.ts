/**
 * AIMI Engine — Event Severity
 * WFS Universal CMMS
 * Scaffold only. No business logic.
 */

export class EventSeverityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EventSeverityError";
  }
}

export class EventSeverityNotFoundError extends EventSeverityError {
  constructor(code: string) {
    super(`Event severity not found for code: ${code}`);
    this.name = "EventSeverityNotFoundError";
  }
}
