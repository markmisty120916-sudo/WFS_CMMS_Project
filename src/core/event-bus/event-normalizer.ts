/**
 * EventBusModule — Core
 * Master Blueprint V2 / EVENT-BUS-SPEC §4–§17
 * Normalization seals the immutable event. Payload is not rewritten.
 */

import type { EventCategory, EventRole, IncomingEvent, IntegrationEvent } from "./event.interface";

export function categoryForEventType(event_type: string): EventCategory {
  if (event_type === "asset.created") {
    return "notification";
  }
  if (event_type === "asset.updated") {
    return "notification";
  }
  if (event_type === "asset.deleted") {
    return "notification";
  }
  if (event_type === "bulk_import.completed") {
    return "notification";
  }
  if (event_type === "bulk_import.failed") {
    return "notification";
  }
  if (event_type === "configuration_pack.applied") {
    return "pm";
  }
  if (event_type === "aimi.predictive.generated") {
    return "aimi.predictive";
  }
  if (event_type === "aimi.predictive.updated") {
    return "aimi.predictive";
  }
  if (event_type === "aimi.predictive.escalated") {
    return "aimi.predictive";
  }
  if (event_type === "aimi.learning.insight.generated") {
    return "aimi.learning";
  }
  if (event_type === "aimi.learning.insight.approved") {
    return "aimi.learning";
  }
  if (event_type === "aimi.learning.insight.applied") {
    return "aimi.learning";
  }
  if (event_type === "aimi.insight.generated") {
    return "aimi.insight";
  }
  if (event_type === "aimi.insight.updated") {
    return "aimi.insight";
  }
  if (event_type === "aimi.insight.approved") {
    return "aimi.insight";
  }
  if (event_type === "aimi.insight.applied") {
    return "aimi.insight";
  }
  if (event_type === "workorder.created") {
    return "workorder.lifecycle";
  }
  if (event_type === "workorder.updated") {
    return "workorder.lifecycle";
  }
  if (event_type === "workorder.assigned") {
    return "workorder.lifecycle";
  }
  if (event_type === "workorder.started") {
    return "workorder.lifecycle";
  }
  if (event_type === "workorder.waiting_parts") {
    return "workorder.lifecycle";
  }
  if (event_type === "workorder.on_hold") {
    return "workorder.lifecycle";
  }
  if (event_type === "workorder.completed") {
    return "workorder.lifecycle";
  }
  if (event_type === "workorder.closed") {
    return "workorder.lifecycle";
  }
  if (event_type === "workorder.escalated") {
    return "workorder.lifecycle";
  }
  if (event_type === "routing.assigned") {
    return "routing";
  }
  if (event_type === "routing.updated") {
    return "routing";
  }
  if (event_type === "routing.conflict") {
    return "routing";
  }
  if (event_type === "routing.overridden") {
    return "routing";
  }
  if (event_type === "scheduling.created") {
    return "scheduling";
  }
  if (event_type === "scheduling.updated") {
    return "scheduling";
  }
  if (event_type === "scheduling.escalated") {
    return "scheduling";
  }
  if (event_type === "scheduling.conflict") {
    return "scheduling";
  }
  if (event_type === "scheduling.canceled") {
    return "scheduling";
  }
  if (event_type === "diagnostic.step.started") {
    return "diagnostic";
  }
  if (event_type === "diagnostic.step.completed") {
    return "diagnostic";
  }
  if (event_type === "diagnostic.step.skipped") {
    return "diagnostic";
  }
  if (event_type === "diagnostic.verification.completed") {
    return "diagnostic";
  }
  if (event_type === "pm.started") {
    return "pm";
  }
  if (event_type === "pm.finding.logged") {
    return "pm";
  }
  if (event_type === "pm.completed") {
    return "pm";
  }
  if (event_type === "pm.compliance.failed") {
    return "pm";
  }
  if (event_type === "pm.compliance.passed") {
    return "pm";
  }
  if (event_type === "compliance.triggered") {
    return "compliance";
  }
  if (event_type === "compliance.workorder.created") {
    return "compliance";
  }
  if (event_type === "compliance.approved") {
    return "compliance";
  }
  if (event_type === "compliance.scheduled") {
    return "compliance";
  }
  if (event_type === "compliance.assigned") {
    return "compliance";
  }
  if (event_type === "compliance.execution.completed") {
    return "compliance";
  }
  if (event_type === "compliance.qa.approved") {
    return "compliance";
  }
  if (event_type === "compliance.qa.failed") {
    return "compliance";
  }
  if (event_type === "compliance.closed") {
    return "compliance";
  }
  if (event_type === "inventory.part.created") {
    return "inventory";
  }
  if (event_type === "inventory.part.updated") {
    return "inventory";
  }
  if (event_type === "inventory.request.submitted") {
    return "inventory";
  }
  if (event_type === "inventory.request.approved") {
    return "inventory";
  }
  if (event_type === "inventory.request.rejected") {
    return "inventory";
  }
  if (event_type === "inventory.fulfillment.completed") {
    return "inventory";
  }
  if (event_type === "inventory.usage.logged") {
    return "inventory";
  }
  if (event_type === "inventory.reconciliation.completed") {
    return "inventory";
  }
  if (event_type === "inventory.vendor.order.created") {
    return "inventory";
  }
  if (event_type === "notification.generated") {
    return "notification";
  }
  if (event_type === "notification.delivered") {
    return "notification";
  }
  if (event_type === "notification.acknowledged") {
    return "notification";
  }
  if (event_type === "notification.escalated") {
    return "notification";
  }
  if (event_type === "notification.resolved") {
    return "notification";
  }
  if (event_type === "voice.command.received") {
    return "voice";
  }
  if (event_type === "voice.command.processed") {
    return "voice";
  }
  if (event_type === "voice.command.failed") {
    return "voice";
  }
  if (event_type === "voice.command.translated") {
    return "voice";
  }
  if (event_type === "voice.command.logged") {
    return "voice";
  }
  throw new Error("event_type invalid");
}

export function isCategoryAllowedForRole(
  category: EventCategory,
  role: EventRole,
): boolean {
  if (role === "ADMIN") {
    return true;
  }
  if (role === "SILENT MASTER KEY") {
    return true;
  }
  if (role === "DRIVER") {
    if (category === "notification") {
      return true;
    }
    if (category === "voice") {
      return true;
    }
    return false;
  }
  if (role === "TECHNICIAN") {
    if (category === "workorder.lifecycle") {
      return true;
    }
    if (category === "diagnostic") {
      return true;
    }
    if (category === "pm") {
      return true;
    }
    if (category === "notification") {
      return true;
    }
    if (category === "voice") {
      return true;
    }
    return false;
  }
  if (role === "MASTER TECHNICIAN") {
    if (category === "workorder.lifecycle") {
      return true;
    }
    if (category === "diagnostic") {
      return true;
    }
    if (category === "pm") {
      return true;
    }
    if (category === "routing") {
      return true;
    }
    if (category === "scheduling") {
      return true;
    }
    if (category === "aimi.predictive") {
      return true;
    }
    if (category === "aimi.learning") {
      return true;
    }
    if (category === "aimi.insight") {
      return true;
    }
    if (category === "notification") {
      return true;
    }
    if (category === "voice") {
      return true;
    }
    return false;
  }
  if (role === "PARTS MANAGER") {
    if (category === "inventory") {
      return true;
    }
    if (category === "notification") {
      return true;
    }
    if (category === "voice") {
      return true;
    }
    return false;
  }
  if (role === "FLEET MANAGER") {
    if (category === "workorder.lifecycle") {
      return true;
    }
    if (category === "scheduling") {
      return true;
    }
    if (category === "pm") {
      return true;
    }
    if (category === "routing") {
      return true;
    }
    if (category === "aimi.predictive") {
      return true;
    }
    if (category === "aimi.learning") {
      return true;
    }
    if (category === "aimi.insight") {
      return true;
    }
    if (category === "notification") {
      return true;
    }
    if (category === "voice") {
      return true;
    }
    return false;
  }
  if (role === "COMPLIANCE OFFICER") {
    if (category === "compliance") {
      return true;
    }
    if (category === "pm") {
      return true;
    }
    if (category === "notification") {
      return true;
    }
    if (category === "voice") {
      return true;
    }
    return false;
  }
  return false;
}

export function normalizeEvent(incoming: IncomingEvent): IntegrationEvent {
  if (incoming.event_id === undefined || incoming.event_id === "") {
    throw new Error("event_id required");
  }
  if (incoming.event_type === undefined || incoming.event_type === "") {
    throw new Error("event_type required");
  }
  if (incoming.event_source === undefined || incoming.event_source === "") {
    throw new Error("event_source required");
  }
  if (incoming.tenant_id === undefined || incoming.tenant_id === "") {
    throw new Error("tenant_id required");
  }
  if (incoming.user_id === undefined || incoming.user_id === "") {
    throw new Error("user_id required");
  }
  if (incoming.role === undefined) {
    throw new Error("role required");
  }
  if (incoming.timestamp === undefined || incoming.timestamp === "") {
    throw new Error("timestamp required");
  }

  const event_category = categoryForEventType(incoming.event_type);
  if (incoming.event_category !== undefined) {
    if (incoming.event_category !== event_category) {
      throw new Error("event_category mismatch");
    }
  }

  let event_payload: unknown = incoming.event_payload;
  if (event_payload === undefined) {
    event_payload = {};
  }

  const event: IntegrationEvent = {
    event_id: incoming.event_id,
    event_type: incoming.event_type,
    event_category,
    event_source: incoming.event_source,
    event_payload,
    tenant_id: incoming.tenant_id,
    user_id: incoming.user_id,
    role: incoming.role,
    timestamp: incoming.timestamp,
  };

  return Object.freeze(event);
}
