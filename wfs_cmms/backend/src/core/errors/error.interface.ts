/**
 * Errors Layer — Core
 * Master Blueprint V2 / AIMI-RULES §2.3
 * Immutable error definition. No dynamic fields.
 */

import type { IncomingEvent } from "../event-bus/event.interface";
import type { ResultRole } from "../results/result-context";
import type { ErrorCategory } from "./error-categories";
import type { ErrorType } from "./error-types";

export type CoreError = {
  readonly category: ErrorCategory;
  readonly error_type: ErrorType;
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: ResultRole;
  readonly timestamp: string;
  readonly correlation_id: string;
};

export function incomingEventFromError(error: CoreError): IncomingEvent {
  return {
    event_id: error.correlation_id + ":" + error.error_type,
    event_type: "notification.generated",
    event_source: "errors",
    event_payload: {
      category: error.category,
      severity: "S3 Medium",
    },
    tenant_id: error.tenant_id,
    user_id: error.user_id,
    role: error.role,
    timestamp: error.timestamp,
  };
}
