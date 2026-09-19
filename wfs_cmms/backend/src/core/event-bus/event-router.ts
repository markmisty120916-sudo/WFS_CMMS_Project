/**
 * EventBusModule — Core
 * Master Blueprint V2 / EVENT-BUS-SPEC §18
 * Tenant-scoped routing. No cross-tenant targets. No new categories.
 */

import { isCategoryAllowedForRole } from "./event-normalizer";
import type {
  EventCategory,
  EventModuleTarget,
  EventRoute,
  IntegrationEvent,
} from "./event.interface";

export function moduleTargetForCategory(category: EventCategory): EventModuleTarget {
  if (category === "aimi.predictive") {
    return "aimi.core";
  }
  if (category === "aimi.learning") {
    return "aimi.core";
  }
  if (category === "aimi.insight") {
    return "aimi.core";
  }
  if (category === "notification") {
    return "notification.engine";
  }
  if (category === "workorder.lifecycle") {
    return "workorders";
  }
  if (category === "routing") {
    return "routing";
  }
  if (category === "scheduling") {
    return "scheduling";
  }
  if (category === "diagnostic") {
    return "diagnostics";
  }
  if (category === "pm") {
    return "pm";
  }
  if (category === "compliance") {
    return "compliance";
  }
  if (category === "inventory") {
    return "inventory";
  }
  return "voice";
}

export function routeEvent(event: IntegrationEvent): EventRoute {
  if (event.tenant_id === "") {
    throw new Error("tenant_id required");
  }
  if (isCategoryAllowedForRole(event.event_category, event.role) === false) {
    throw new Error("role unauthorized");
  }
  return {
    tenant_id: event.tenant_id,
    target: moduleTargetForCategory(event.event_category),
  };
}
