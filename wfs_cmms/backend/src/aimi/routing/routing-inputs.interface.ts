/**
 * AIMI Routing Engine
 * Master Blueprint V2 / AIMI-ROUTING §3–§7
 * Coded candidates only. No inferred skill. No cross-tenant candidates.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type { SeverityLevel } from "../severity/severity-levels";

export type TechnicianSpeed = "Slow" | "Medium" | "Fast";

export type TechnicianCandidate = {
  readonly technician_id: string;
  readonly tenant_id: string;
  readonly certified_asset_class: boolean;
  readonly certified_repair_type: boolean;
  readonly certified_diagnostic_flow: boolean;
  readonly blocked_by_compliance: boolean;
  readonly blocked_by_scheduling: boolean;
  readonly over_workload_threshold: boolean;
  readonly assigned_to_s1_s2: boolean;
  readonly unavailable_shift: boolean;
  readonly unavailable_pto: boolean;
  readonly unavailable_training: boolean;
  readonly overloaded_s1_s2: boolean;
  readonly overloaded_pm: boolean;
  readonly overloaded_diagnostics: boolean;
  readonly speed: TechnicianSpeed;
};

export type BayCandidate = {
  readonly bay_id: string;
  readonly tenant_id: string;
  readonly available: boolean;
  readonly compatible_asset_class: boolean;
  readonly equipped: boolean;
  readonly specialized: boolean;
  readonly restricted: boolean;
};

export type RoutingInputs = {
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
  readonly timestamp: string;
  readonly workorder_id: string;
  readonly asset_id: string;
  readonly severity: SeverityLevel;
  readonly workorder_is_pm: boolean;
  readonly workorder_is_diagnostic: boolean;
  readonly technicians: readonly TechnicianCandidate[];
  readonly bays: readonly BayCandidate[];
};
