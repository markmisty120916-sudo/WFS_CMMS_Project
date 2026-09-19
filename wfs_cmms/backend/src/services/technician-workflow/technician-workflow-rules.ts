import type { DtoRole } from "../../core/dto/base.dto";
import type { ErrorType } from "../../core/errors/error-types";

export function canWriteTechnicianWorkflow(role: DtoRole): boolean {
  if (role === "TECHNICIAN") {
    return true;
  }
  if (role === "MASTER TECHNICIAN") {
    return true;
  }
  if (role === "SILENT MASTER KEY") {
    return true;
  }
  return false;
}

export function canReadTechnicianWorkflow(role: DtoRole): boolean {
  if (canWriteTechnicianWorkflow(role) === true) {
    return true;
  }
  if (role === "FLEET MANAGER") {
    return true;
  }
  if (role === "ADMIN") {
    return true;
  }
  return false;
}

export function canPublishWorkflowCompleted(role: DtoRole): boolean {
  if (role === "TECHNICIAN") {
    return true;
  }
  if (role === "MASTER TECHNICIAN") {
    return true;
  }
  if (role === "ADMIN") {
    return true;
  }
  if (role === "SILENT MASTER KEY") {
    return true;
  }
  return false;
}

export function isWorkflowCompleted(status: string): boolean {
  if (status === "completed") {
    return true;
  }
  return false;
}

export function technicianAssignmentError(
  role: DtoRole,
  user_id: string,
  routing_tech_id: string,
): ErrorType | "none" {
  if (role !== "TECHNICIAN") {
    return "none";
  }
  if (routing_tech_id === "") {
    return "none";
  }
  if (routing_tech_id !== user_id) {
    return "role unauthorized";
  }
  return "none";
}

export function workflowTenantError(tenant_id: string, record_tenant_id: string): ErrorType | "none" {
  if (record_tenant_id !== tenant_id) {
    return "tenant_id mismatch";
  }
  return "none";
}

export function workflowWriteError(role: DtoRole): ErrorType | "none" {
  if (canWriteTechnicianWorkflow(role) === false) {
    return "role unauthorized";
  }
  return "none";
}

export function workflowReadError(role: DtoRole): ErrorType | "none" {
  if (canReadTechnicianWorkflow(role) === false) {
    return "role unauthorized";
  }
  return "none";
}

export function workflowImmutableError(status: string): ErrorType | "none" {
  if (isWorkflowCompleted(status) === true) {
    return "lifecycle transition invalid";
  }
  return "none";
}
