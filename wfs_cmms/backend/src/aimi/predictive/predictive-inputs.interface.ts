/**
 * AIMI Predictive Engine
 * Master Blueprint V2 / AIMI-PREDICTIVE §3–§6
 * Coded inputs only. No inferred scores. No cross-tenant fields.
 */

import type { DtoRole } from "../../core/dto/base.dto";

export type FailureRisk = "Imminent" | "High" | "Medium" | "Low";

export type TelematicsClusterLevel = "none" | "critical" | "major" | "moderate" | "minor";
export type PredictivePmLevel = "none" | "overdue" | "upcoming";
export type DiagnosticHistoryLevel = "none" | "repeated_failures" | "slow_verification";
export type AssetHealthLevel = "none" | "rapid_decline" | "moderate_decline";
export type UsagePatternLevel = "none" | "extreme" | "moderate";
export type TechnicianNotePredictiveLevel = "none" | "moderate_concern";

export type PredictiveInputs = {
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
  readonly timestamp: string;
  readonly workorder_id: string;
  readonly asset_id: string;
  readonly telematics_cluster: TelematicsClusterLevel;
  readonly pm: PredictivePmLevel;
  readonly diagnostic: DiagnosticHistoryLevel;
  readonly asset_health: AssetHealthLevel;
  readonly usage: UsagePatternLevel;
  readonly environmental: UsagePatternLevel;
  readonly technician_notes: TechnicianNotePredictiveLevel;
  readonly compliance_block: boolean;
  readonly repeated_s1_s2: boolean;
  readonly repeated_s2: boolean;
};
