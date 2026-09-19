/**
 * LifecycleEngine — Core
 * Master Blueprint V2 / WORKORDER-LIFECYCLE / COMPLIANCE-FLOW §4 / PARTS-INVENTORY-FLOW §3 / workflows §3–§4
 * Preconditions, postconditions, invariants. No skipped or merged stages.
 */

import type { LifecycleContext } from "./lifecycle-context";
import type { LifecycleSnapshot } from "./lifecycle-snapshot";
import type { LifecycleKind, LifecycleRole, LifecycleState } from "./lifecycle-state.interface";
import type { LifecycleTransition } from "./lifecycle-transition.interface";

export function initialStateForKind(kind: LifecycleKind): LifecycleState {
  if (kind === "workorder") {
    return "CREATED";
  }
  if (kind === "pm") {
    return "PM_SCHEDULED";
  }
  if (kind === "compliance") {
    return "COMPLIANCE_TRIGGER";
  }
  if (kind === "inventory") {
    return "PART_CREATION";
  }
  if (kind === "diagnostic") {
    return "SYMPTOM_INTAKE";
  }
  if (kind === "scheduling") {
    return "CREATED";
  }
  return "ASSIGNED";
}

export function isTransitionAllowed(transition: LifecycleTransition): boolean {
  if (transition.kind === "workorder") {
    if (transition.from_state === "CREATED" && transition.to_state === "AIMI_SEVERITY_ASSIGNED") {
      return true;
    }
    if (transition.from_state === "AIMI_SEVERITY_ASSIGNED" && transition.to_state === "ROUTED") {
      return true;
    }
    if (transition.from_state === "ROUTED" && transition.to_state === "SCHEDULED") {
      return true;
    }
    if (transition.from_state === "SCHEDULED" && transition.to_state === "IN_PROGRESS") {
      return true;
    }
    if (transition.from_state === "IN_PROGRESS" && transition.to_state === "WAITING_PARTS") {
      return true;
    }
    if (transition.from_state === "IN_PROGRESS" && transition.to_state === "ON_HOLD") {
      return true;
    }
    if (transition.from_state === "IN_PROGRESS" && transition.to_state === "COMPLETED") {
      return true;
    }
    if (transition.from_state === "WAITING_PARTS" && transition.to_state === "IN_PROGRESS") {
      return true;
    }
    if (transition.from_state === "ON_HOLD" && transition.to_state === "IN_PROGRESS") {
      return true;
    }
    if (transition.from_state === "COMPLETED" && transition.to_state === "CLOSED") {
      return true;
    }
    return false;
  }
  if (transition.kind === "pm") {
    if (transition.from_state === "PM_SCHEDULED" && transition.to_state === "PM_ASSIGNED") {
      return true;
    }
    if (transition.from_state === "PM_ASSIGNED" && transition.to_state === "PM_IN_PROGRESS") {
      return true;
    }
    if (transition.from_state === "PM_IN_PROGRESS" && transition.to_state === "PM_FINDINGS_LOGGED") {
      return true;
    }
    if (transition.from_state === "PM_FINDINGS_LOGGED" && transition.to_state === "PM_SEVERITY_ASSIGNED") {
      return true;
    }
    if (transition.from_state === "PM_SEVERITY_ASSIGNED" && transition.to_state === "PM_COMPLETED") {
      return true;
    }
    if (transition.from_state === "PM_COMPLETED" && transition.to_state === "PM_PREDICTIVE_UPDATE") {
      return true;
    }
    if (transition.from_state === "PM_COMPLETED" && transition.to_state === "PM_WORKORDER_CREATION") {
      return true;
    }
    if (transition.from_state === "PM_PREDICTIVE_UPDATE" && transition.to_state === "PM_WORKORDER_CREATION") {
      return true;
    }
    return false;
  }
  if (transition.kind === "compliance") {
    if (transition.from_state === "COMPLIANCE_TRIGGER" && transition.to_state === "AIMI_COMPLIANCE_INTAKE") {
      return true;
    }
    if (transition.from_state === "AIMI_COMPLIANCE_INTAKE" && transition.to_state === "COMPLIANCE_WORKORDER_DRAFT") {
      return true;
    }
    if (transition.from_state === "COMPLIANCE_WORKORDER_DRAFT" && transition.to_state === "CONDITIONAL_APPROVAL_LOGIC") {
      return true;
    }
    if (transition.from_state === "CONDITIONAL_APPROVAL_LOGIC" && transition.to_state === "AIMI_COMPLIANCE_SCHEDULING") {
      return true;
    }
    if (transition.from_state === "AIMI_COMPLIANCE_SCHEDULING" && transition.to_state === "AIMI_COMPLIANCE_ASSIGNMENT") {
      return true;
    }
    if (transition.from_state === "AIMI_COMPLIANCE_ASSIGNMENT" && transition.to_state === "COMPLIANCE_EXECUTION") {
      return true;
    }
    if (transition.from_state === "COMPLIANCE_EXECUTION" && transition.to_state === "COMPLIANCE_QA_REVIEW") {
      return true;
    }
    if (transition.from_state === "COMPLIANCE_QA_REVIEW" && transition.to_state === "COMPLIANCE_CLOSURE") {
      return true;
    }
    if (transition.from_state === "COMPLIANCE_CLOSURE" && transition.to_state === "COMPLIANCE_REPORTING") {
      return true;
    }
    if (transition.from_state === "COMPLIANCE_REPORTING" && transition.to_state === "AIMI_PREDICTIVE_COMPLIANCE_UPDATES") {
      return true;
    }
    return false;
  }
  if (transition.kind === "inventory") {
    if (transition.from_state === "PART_CREATION" && transition.to_state === "STOCK_MANAGEMENT") {
      return true;
    }
    if (transition.from_state === "STOCK_MANAGEMENT" && transition.to_state === "PART_REQUEST_INTAKE") {
      return true;
    }
    if (transition.from_state === "PART_REQUEST_INTAKE" && transition.to_state === "PART_APPROVAL") {
      return true;
    }
    if (transition.from_state === "PART_APPROVAL" && transition.to_state === "PART_FULFILLMENT") {
      return true;
    }
    if (transition.from_state === "PART_FULFILLMENT" && transition.to_state === "PART_USAGE_LOGGING") {
      return true;
    }
    if (transition.from_state === "PART_USAGE_LOGGING" && transition.to_state === "INVENTORY_RECONCILIATION") {
      return true;
    }
    if (transition.from_state === "INVENTORY_RECONCILIATION" && transition.to_state === "VENDOR_ORDERING") {
      return true;
    }
    return false;
  }
  if (transition.kind === "diagnostic") {
    if (transition.from_state === "SYMPTOM_INTAKE" && transition.to_state === "FAULT_CORRELATION") {
      return true;
    }
    if (transition.from_state === "FAULT_CORRELATION" && transition.to_state === "DIAGNOSTIC_PATH_SELECTION") {
      return true;
    }
    if (transition.from_state === "DIAGNOSTIC_PATH_SELECTION" && transition.to_state === "STEP_BY_STEP_TROUBLESHOOTING") {
      return true;
    }
    if (transition.from_state === "STEP_BY_STEP_TROUBLESHOOTING" && transition.to_state === "TECHNICIAN_LEARNING_CAPTURE") {
      return true;
    }
    if (transition.from_state === "TECHNICIAN_LEARNING_CAPTURE" && transition.to_state === "REPAIR_RECOMMENDATION") {
      return true;
    }
    if (transition.from_state === "REPAIR_RECOMMENDATION" && transition.to_state === "VERIFICATION_STEPS") {
      return true;
    }
    if (transition.from_state === "VERIFICATION_STEPS" && transition.to_state === "CLOSEOUT_CHECKLIST") {
      return true;
    }
    return false;
  }
  if (transition.kind === "scheduling") {
    if (transition.from_state === "CREATED" && transition.to_state === "UPDATED") {
      return true;
    }
    if (transition.from_state === "CREATED" && transition.to_state === "ESCALATED") {
      return true;
    }
    if (transition.from_state === "CREATED" && transition.to_state === "CONFLICT") {
      return true;
    }
    if (transition.from_state === "CREATED" && transition.to_state === "CANCELED") {
      return true;
    }
    if (transition.from_state === "UPDATED" && transition.to_state === "ESCALATED") {
      return true;
    }
    if (transition.from_state === "UPDATED" && transition.to_state === "CONFLICT") {
      return true;
    }
    if (transition.from_state === "UPDATED" && transition.to_state === "CANCELED") {
      return true;
    }
    return false;
  }
  if (transition.from_state === "ASSIGNED" && transition.to_state === "UPDATED") {
    return true;
  }
  if (transition.from_state === "ASSIGNED" && transition.to_state === "CONFLICT") {
    return true;
  }
  if (transition.from_state === "ASSIGNED" && transition.to_state === "OVERRIDDEN") {
    return true;
  }
  if (transition.from_state === "UPDATED" && transition.to_state === "CONFLICT") {
    return true;
  }
  if (transition.from_state === "UPDATED" && transition.to_state === "OVERRIDDEN") {
    return true;
  }
  return false;
}

export function isRoleAllowedForKind(kind: LifecycleKind, role: LifecycleRole): boolean {
  if (role === "ADMIN") {
    return true;
  }
  if (role === "SILENT MASTER KEY") {
    return true;
  }
  if (kind === "workorder") {
    if (role === "TECHNICIAN") {
      return true;
    }
    if (role === "MASTER TECHNICIAN") {
      return true;
    }
    if (role === "FLEET MANAGER") {
      return true;
    }
    return false;
  }
  if (kind === "pm") {
    if (role === "TECHNICIAN") {
      return true;
    }
    if (role === "MASTER TECHNICIAN") {
      return true;
    }
    if (role === "FLEET MANAGER") {
      return true;
    }
    if (role === "COMPLIANCE OFFICER") {
      return true;
    }
    return false;
  }
  if (kind === "compliance") {
    if (role === "COMPLIANCE OFFICER") {
      return true;
    }
    if (role === "FLEET MANAGER") {
      return true;
    }
    if (role === "MASTER TECHNICIAN") {
      return true;
    }
    return false;
  }
  if (kind === "inventory") {
    if (role === "PARTS MANAGER") {
      return true;
    }
    if (role === "TECHNICIAN") {
      return true;
    }
    if (role === "MASTER TECHNICIAN") {
      return true;
    }
    return false;
  }
  if (kind === "diagnostic") {
    if (role === "TECHNICIAN") {
      return true;
    }
    if (role === "MASTER TECHNICIAN") {
      return true;
    }
    return false;
  }
  if (kind === "scheduling") {
    if (role === "MASTER TECHNICIAN") {
      return true;
    }
    if (role === "FLEET MANAGER") {
      return true;
    }
    return false;
  }
  if (role === "MASTER TECHNICIAN") {
    return true;
  }
  if (role === "FLEET MANAGER") {
    return true;
  }
  return false;
}

export function assertPreconditions(
  current: LifecycleSnapshot,
  context: LifecycleContext,
  to_state: LifecycleState,
): void {
  if (context.tenant_id === "") {
    throw new Error("tenant_id required");
  }
  if (current.tenant_id !== context.tenant_id) {
    throw new Error("tenant_id mismatch");
  }
  if (current.kind !== context.kind) {
    throw new Error("lifecycle kind mismatch");
  }
  if (current.entity_id !== context.entity_id) {
    throw new Error("entity_id mismatch");
  }
  if (current.state !== context.state) {
    throw new Error("lifecycle state mismatch");
  }
  if (isRoleAllowedForKind(context.kind, context.role) === false) {
    throw new Error("role unauthorized");
  }
  if (context.kind === "workorder") {
    if (to_state === "CLOSED") {
      if (context.role === "TECHNICIAN") {
        throw new Error("role unauthorized");
      }
    }
  }
  if (context.kind === "inventory") {
    if (to_state === "PART_APPROVAL") {
      if (context.role === "TECHNICIAN") {
        throw new Error("role unauthorized");
      }
    }
    if (to_state === "PART_FULFILLMENT") {
      if (context.role === "TECHNICIAN") {
        throw new Error("role unauthorized");
      }
    }
    if (to_state === "VENDOR_ORDERING") {
      if (context.role === "TECHNICIAN") {
        throw new Error("role unauthorized");
      }
    }
  }
  const allowed = isTransitionAllowed({
    kind: context.kind,
    from_state: current.state,
    to_state,
  });
  if (allowed === false) {
    throw new Error("lifecycle transition invalid");
  }
}

export function assertPostconditions(
  next: LifecycleSnapshot,
  expected_state: LifecycleState,
  tenant_id: string,
): void {
  if (next.state !== expected_state) {
    throw new Error("lifecycle postcondition failed");
  }
  if (next.tenant_id !== tenant_id) {
    throw new Error("tenant_id mismatch");
  }
}

export function assertInvariants(
  current: LifecycleSnapshot,
  next: LifecycleSnapshot,
): void {
  if (next.tenant_id !== current.tenant_id) {
    throw new Error("tenant_id mismatch");
  }
  if (next.kind !== current.kind) {
    throw new Error("lifecycle kind mismatch");
  }
  if (next.entity_id !== current.entity_id) {
    throw new Error("entity_id mismatch");
  }
}
