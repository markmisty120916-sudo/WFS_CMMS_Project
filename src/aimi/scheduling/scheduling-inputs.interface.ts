/**
 * AIMI Scheduling Engine
 * Master Blueprint V2 / AIMI-SCHEDULING §3–§9
 * Coded inputs only. No inferred windows. No cross-tenant slots.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type { TechnicianSpeed } from "../routing/routing-inputs.interface";
import type { SeverityLevel } from "../severity/severity-levels";

export type SchedulingWindow =
  | "Immediate Window"
  | "Urgent Window"
  | "Standard Window"
  | "Deferred Window"
  | "No Scheduling Required";

export type PredictiveSchedulingLevel = "none" | "imminent_failure" | "high_risk";
export type PmSchedulingLevel = "none" | "overdue" | "upcoming";

export type SchedulingTechnician = {
  readonly technician_id: string;
  readonly tenant_id: string;
  readonly highly_skilled: boolean;
  readonly unavailable_shift: boolean;
  readonly unavailable_pto: boolean;
  readonly unavailable_training: boolean;
  readonly over_workload_threshold: boolean;
  readonly overloaded_s1_s2: boolean;
  readonly overloaded_pm: boolean;
  readonly overloaded_diagnostics: boolean;
  readonly speed: TechnicianSpeed;
};

export type SchedulingBay = {
  readonly bay_id: string;
  readonly tenant_id: string;
  readonly available_now: boolean;
  readonly available_soon: boolean;
  readonly available: boolean;
  readonly compatible_asset_class: boolean;
  readonly equipped: boolean;
  readonly specialized: boolean;
  readonly restricted: boolean;
  readonly downtime: boolean;
  readonly occupancy_blocked: boolean;
};

export type SchedulingAsset = {
  readonly asset_id: string;
  readonly tenant_id: string;
  readonly restricted_operation: boolean;
  readonly compliance_block: boolean;
};

export type SchedulingWindowSlot = {
  readonly tenant_id: string;
  readonly window: SchedulingWindow;
  readonly scheduled_start: string;
  readonly scheduled_end: string;
};

export type SchedulingInputs = {
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
  readonly timestamp: string;
  readonly workorder_id: string;
  readonly asset_id: string;
  readonly severity: SeverityLevel;
  readonly routed_technician_id: string;
  readonly routed_bay_id: string;
  readonly workorder_is_pm: boolean;
  readonly workorder_is_diagnostic: boolean;
  readonly predictive: PredictiveSchedulingLevel;
  readonly pm: PmSchedulingLevel;
  readonly compliance_violation: boolean;
  readonly asset: SchedulingAsset;
  readonly technicians: readonly SchedulingTechnician[];
  readonly bays: readonly SchedulingBay[];
  readonly windows: readonly SchedulingWindowSlot[];
};
