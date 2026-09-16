/**
 * AIMI Diagnostics Engine
 * Master Blueprint V2 / AIMI-DIAGNOSTIC-FLOWS §3–§13 / diagnostics.md §7
 * Coded catalog only. No invented steps, repairs, or parts.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type { TechnicianSpeed } from "../routing/routing-inputs.interface";
import type { SeverityLevel } from "../severity/severity-levels";

export type DiagnosticPathType =
  | "Telematics-Driven Path"
  | "Driver-Defect Path"
  | "PM-Finding Path"
  | "Technician-Reported Path"
  | "Predictive-Alert Path"
  | "Hybrid Path";

export type DiagnosticStep = {
  readonly step_id: string;
  readonly diagnostic_flow_id: string;
  readonly tenant_id: string;
  readonly path: DiagnosticPathType;
  readonly safety_required: boolean;
  readonly asset_type_match: boolean;
  readonly technician_skill_match: boolean;
  readonly technician_speed_match: boolean;
  readonly shop_pattern_match: boolean;
  readonly fleet_pattern_match: boolean;
  readonly predictive_urgency_match: boolean;
};

export type DiagnosticFlow = {
  readonly diagnostic_flow_id: string;
  readonly tenant_id: string;
  readonly path: DiagnosticPathType;
  readonly repair_id: string;
  readonly part_id: string;
  readonly labor_id: string;
};

export type DiagnosticInputs = {
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
  readonly timestamp: string;
  readonly workorder_id: string;
  readonly asset_id: string;
  readonly technician_id: string;
  readonly severity: SeverityLevel;
  readonly technician_speed: TechnicianSpeed;
  readonly telematics_fault: boolean;
  readonly driver_defect: boolean;
  readonly pm_finding: boolean;
  readonly technician_note: boolean;
  readonly predictive_alert: boolean;
  readonly predictive_urgency: boolean;
  readonly certified_diagnostic_flow: boolean;
  readonly flows: readonly DiagnosticFlow[];
  readonly steps: readonly DiagnosticStep[];
};
