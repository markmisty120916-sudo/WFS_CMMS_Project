/**
 * LifecycleEngine — Core
 * Master Blueprint V2 / EVENT-BUS-SPEC §6–§17
 * Maps lifecycle states to existing EventBus types only. No new categories.
 */

import type { IncomingEvent } from "../event-bus/event.interface";
import type { LifecycleSnapshot } from "./lifecycle-snapshot";

export function eventTypeForSnapshot(snapshot: LifecycleSnapshot): string {
  if (snapshot.kind === "workorder") {
    if (snapshot.state === "CREATED") {
      return "workorder.created";
    }
    if (snapshot.state === "AIMI_SEVERITY_ASSIGNED") {
      return "workorder.updated";
    }
    if (snapshot.state === "ROUTED") {
      return "workorder.assigned";
    }
    if (snapshot.state === "SCHEDULED") {
      return "scheduling.created";
    }
    if (snapshot.state === "IN_PROGRESS") {
      return "workorder.started";
    }
    if (snapshot.state === "WAITING_PARTS") {
      return "workorder.waiting_parts";
    }
    if (snapshot.state === "ON_HOLD") {
      return "workorder.on_hold";
    }
    if (snapshot.state === "COMPLETED") {
      return "workorder.completed";
    }
    if (snapshot.state === "CLOSED") {
      return "workorder.closed";
    }
  }
  if (snapshot.kind === "pm") {
    if (snapshot.state === "PM_SCHEDULED") {
      return "scheduling.created";
    }
    if (snapshot.state === "PM_ASSIGNED") {
      return "scheduling.updated";
    }
    if (snapshot.state === "PM_IN_PROGRESS") {
      return "pm.started";
    }
    if (snapshot.state === "PM_FINDINGS_LOGGED") {
      return "pm.finding.logged";
    }
    if (snapshot.state === "PM_SEVERITY_ASSIGNED") {
      return "pm.started";
    }
    if (snapshot.state === "PM_COMPLETED") {
      return "pm.completed";
    }
    if (snapshot.state === "PM_PREDICTIVE_UPDATE") {
      return "aimi.predictive.updated";
    }
    if (snapshot.state === "PM_WORKORDER_CREATION") {
      return "workorder.created";
    }
  }
  if (snapshot.kind === "compliance") {
    if (snapshot.state === "COMPLIANCE_TRIGGER") {
      return "compliance.triggered";
    }
    if (snapshot.state === "AIMI_COMPLIANCE_INTAKE") {
      return "compliance.triggered";
    }
    if (snapshot.state === "COMPLIANCE_WORKORDER_DRAFT") {
      return "compliance.workorder.created";
    }
    if (snapshot.state === "CONDITIONAL_APPROVAL_LOGIC") {
      return "compliance.approved";
    }
    if (snapshot.state === "AIMI_COMPLIANCE_SCHEDULING") {
      return "compliance.scheduled";
    }
    if (snapshot.state === "AIMI_COMPLIANCE_ASSIGNMENT") {
      return "compliance.assigned";
    }
    if (snapshot.state === "COMPLIANCE_EXECUTION") {
      return "compliance.execution.completed";
    }
    if (snapshot.state === "COMPLIANCE_QA_REVIEW") {
      return "compliance.qa.approved";
    }
    if (snapshot.state === "COMPLIANCE_CLOSURE") {
      return "compliance.closed";
    }
    if (snapshot.state === "COMPLIANCE_REPORTING") {
      return "notification.generated";
    }
    if (snapshot.state === "AIMI_PREDICTIVE_COMPLIANCE_UPDATES") {
      return "aimi.predictive.updated";
    }
  }
  if (snapshot.kind === "inventory") {
    if (snapshot.state === "PART_CREATION") {
      return "inventory.part.created";
    }
    if (snapshot.state === "STOCK_MANAGEMENT") {
      return "inventory.part.updated";
    }
    if (snapshot.state === "PART_REQUEST_INTAKE") {
      return "inventory.request.submitted";
    }
    if (snapshot.state === "PART_APPROVAL") {
      return "inventory.request.approved";
    }
    if (snapshot.state === "PART_FULFILLMENT") {
      return "inventory.fulfillment.completed";
    }
    if (snapshot.state === "PART_USAGE_LOGGING") {
      return "inventory.usage.logged";
    }
    if (snapshot.state === "INVENTORY_RECONCILIATION") {
      return "inventory.reconciliation.completed";
    }
    if (snapshot.state === "VENDOR_ORDERING") {
      return "inventory.vendor.order.created";
    }
  }
  if (snapshot.kind === "diagnostic") {
    if (snapshot.state === "SYMPTOM_INTAKE") {
      return "diagnostic.step.started";
    }
    if (snapshot.state === "FAULT_CORRELATION") {
      return "diagnostic.step.started";
    }
    if (snapshot.state === "DIAGNOSTIC_PATH_SELECTION") {
      return "diagnostic.step.started";
    }
    if (snapshot.state === "STEP_BY_STEP_TROUBLESHOOTING") {
      return "diagnostic.step.completed";
    }
    if (snapshot.state === "TECHNICIAN_LEARNING_CAPTURE") {
      return "diagnostic.step.completed";
    }
    if (snapshot.state === "REPAIR_RECOMMENDATION") {
      return "diagnostic.step.completed";
    }
    if (snapshot.state === "VERIFICATION_STEPS") {
      return "diagnostic.verification.completed";
    }
    if (snapshot.state === "CLOSEOUT_CHECKLIST") {
      return "diagnostic.verification.completed";
    }
  }
  if (snapshot.kind === "scheduling") {
    if (snapshot.state === "CREATED") {
      return "scheduling.created";
    }
    if (snapshot.state === "UPDATED") {
      return "scheduling.updated";
    }
    if (snapshot.state === "ESCALATED") {
      return "scheduling.escalated";
    }
    if (snapshot.state === "CONFLICT") {
      return "scheduling.conflict";
    }
    if (snapshot.state === "CANCELED") {
      return "scheduling.canceled";
    }
  }
  if (snapshot.state === "ASSIGNED") {
    return "routing.assigned";
  }
  if (snapshot.state === "UPDATED") {
    return "routing.updated";
  }
  if (snapshot.state === "CONFLICT") {
    return "routing.conflict";
  }
  if (snapshot.state === "OVERRIDDEN") {
    return "routing.overridden";
  }
  throw new Error("event_type invalid");
}

export function incomingEventFromSnapshot(snapshot: LifecycleSnapshot): IncomingEvent {
  return {
    event_id: snapshot.kind + ":" + snapshot.entity_id + ":" + snapshot.state + ":" + snapshot.timestamp,
    event_type: eventTypeForSnapshot(snapshot),
    event_source: "lifecycle-engine",
    event_payload: {
      entity_id: snapshot.entity_id,
      kind: snapshot.kind,
      previous_state: snapshot.previous_state,
      state: snapshot.state,
    },
    tenant_id: snapshot.tenant_id,
    user_id: snapshot.user_id,
    role: snapshot.role,
    timestamp: snapshot.timestamp,
  };
}
