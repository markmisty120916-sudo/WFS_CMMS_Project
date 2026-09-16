/**
 * EventBusModule — Core
 * Master Blueprint V2 / BACKEND-STRUCTURE §4 / EVENT-BUS-SPEC §3
 * Factory only. No Nest runtime. No global bus instance.
 */

import { EventBusService, type EventBusServiceOptions } from "./event-bus.service";

export class EventBusModule {
  static create(options: EventBusServiceOptions): EventBusService {
    return new EventBusService(options);
  }
}

export { EventBusService } from "./event-bus.service";
export type { EventBusServiceOptions } from "./event-bus.service";
export type {
  EventAuditAction,
  EventBusRbacHook,
  EventCategory,
  EventModuleTarget,
  EventRole,
  EventRoute,
  EventSubscriber,
  IncomingEvent,
  IntegrationEvent,
} from "./event.interface";
export { normalizeEvent, categoryForEventType, isCategoryAllowedForRole } from "./event-normalizer";
export { routeEvent, moduleTargetForCategory } from "./event-router";
export { deliverEvent } from "./event-delivery";
export { logEvent } from "./event-logger";
export { loadReplayEvents, requireUnmodifiedReplay } from "./event-replay";
export { auditEvent } from "./event-audit";
