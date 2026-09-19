/**
 * AIMI Severity Engine
 * Master Blueprint V2 / AIMI-SEVERITY §3
 * Coded inputs only. No inferred symptoms. No cross-tenant fields.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type { SeverityLevel } from "./severity-levels";

export type TelematicsFaultLevel = "none" | "critical" | "major" | "moderate" | "minor";
export type PredictiveAlertLevel = "none" | "imminent_failure" | "high_risk" | "moderate_risk";
export type PmCheckLevel = "none" | "overdue_beyond_threshold" | "upcoming" | "minor";
export type TechnicianNoteLevel = "none" | "urgent" | "moderate" | "minor" | "informational";
export type DriverDefectLevel = "none" | "safety" | "major" | "moderate" | "minor" | "info";
export type ComplianceCheckLevel = "none" | "blocks_operation" | "requires_correction";

export type SeverityInputs = {
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
  readonly timestamp: string;
  readonly workorder_id: string;
  readonly asset_id: string;
  readonly safety_critical: boolean;
  readonly compliance: ComplianceCheckLevel;
  readonly telematics: TelematicsFaultLevel;
  readonly predictive: PredictiveAlertLevel;
  readonly pm: PmCheckLevel;
  readonly technician_notes: TechnicianNoteLevel;
  readonly driver_defects: DriverDefectLevel;
};

export type SeverityMatch = {
  readonly level: SeverityLevel;
  readonly reason: string;
};
