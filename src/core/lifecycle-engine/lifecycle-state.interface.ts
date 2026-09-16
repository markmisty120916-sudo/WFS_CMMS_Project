/**
 * LifecycleEngine — Core
 * Master Blueprint V2 / cursor-instructions §10
 * Lifecycle kinds. Stages are not merged across kinds.
 */

export type LifecycleKind =
  | "workorder"
  | "pm"
  | "compliance"
  | "inventory"
  | "diagnostic"
  | "scheduling"
  | "routing";

export type LifecycleRole =
  | "DRIVER"
  | "TECHNICIAN"
  | "MASTER TECHNICIAN"
  | "PARTS MANAGER"
  | "FLEET MANAGER"
  | "COMPLIANCE OFFICER"
  | "ADMIN"
  | "SILENT MASTER KEY";

export type LifecycleState = string;
