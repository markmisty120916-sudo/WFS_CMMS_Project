/**
 * EventBusModule — Core
 * Master Blueprint V2 / EVENT-BUS-SPEC §4–§5 / DATABASE-SCHEMA §9
 * Immutable event structure and twelve immutable categories.
 */

export type EventRole =
  | "DRIVER"
  | "TECHNICIAN"
  | "MASTER TECHNICIAN"
  | "PARTS MANAGER"
  | "FLEET MANAGER"
  | "COMPLIANCE OFFICER"
  | "ADMIN"
  | "SILENT MASTER KEY";

export type EventCategory =
  | "aimi.predictive"
  | "aimi.learning"
  | "aimi.insight"
  | "workorder.lifecycle"
  | "routing"
  | "scheduling"
  | "diagnostic"
  | "pm"
  | "compliance"
  | "inventory"
  | "notification"
  | "voice";

export type EventModuleTarget =
  | "aimi.core"
  | "notification.engine"
  | "workorders"
  | "routing"
  | "scheduling"
  | "diagnostics"
  | "pm"
  | "compliance"
  | "inventory"
  | "voice";

export type IntegrationEvent = {
  readonly event_id: string;
  readonly event_type: string;
  readonly event_category: EventCategory;
  readonly event_source: string;
  readonly event_payload: unknown;
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: EventRole;
  readonly timestamp: string;
};

export type IncomingEvent = {
  event_id?: string;
  event_type?: string;
  event_category?: EventCategory;
  event_source?: string;
  event_payload?: unknown;
  tenant_id?: string;
  user_id?: string;
  role?: EventRole;
  timestamp?: string;
};

export type EventRoute = {
  tenant_id: string;
  target: EventModuleTarget;
};

export type EventSubscriber = {
  tenant_id: string;
  role: EventRole;
  target: EventModuleTarget;
  onEvent(event: IntegrationEvent): Promise<void>;
};

export type EventAuditAction =
  | "origin"
  | "routing"
  | "delivery"
  | "acknowledgment"
  | "replay";

export type EventBusRbacHook = {
  assert(event: IntegrationEvent): void;
};
