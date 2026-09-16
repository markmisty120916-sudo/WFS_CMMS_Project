/**
 * AIMI Learning Engine
 * Master Blueprint V2 / AIMI-LEARNING §3–§8
 * Coded capture only. No inferred metrics. No cross-tenant profiles.
 */

import type { DtoRole } from "../../core/dto/base.dto";

export type LearningInsightType = "technician" | "fleet" | "asset";
export type WorkflowSpeedLevel = "FAST" | "MEDIUM" | "SLOW";
export type PerformanceBand = "none" | "high" | "average" | "low";
export type PatternBand = "none" | "effective" | "ineffective";
export type CompletionBand = "none" | "fast" | "average" | "slow";
export type RepeatBand = "none" | "low" | "moderate" | "high";
export type ComplianceBand = "none" | "high" | "moderate" | "low";
export type ValidationBand = "none" | "high" | "moderate" | "low";
export type LearningImpactArea = "routing" | "scheduling" | "PM" | "predictive" | "workflow speed";
export type LearningApprovalStatus = "pending" | "approved" | "applied";

export type LearningWeight = {
  readonly weight_id: string;
  readonly tenant_id: string;
  readonly key: string;
  readonly value: string;
};

export type LearningInputs = {
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
  readonly timestamp: string;
  readonly workorder_id: string;
  readonly asset_id: string;
  readonly technician_id: string;
  readonly insight_type: LearningInsightType;
  readonly technician_performance: PerformanceBand;
  readonly fleet_performance: PerformanceBand;
  readonly pattern: PatternBand;
  readonly diagnostic_completion: CompletionBand;
  readonly repeat_repair: RepeatBand;
  readonly step_compliance: ComplianceBand;
  readonly telematics_validation: ValidationBand;
  readonly diagnostic_steps_taken: boolean;
  readonly diagnostic_steps_skipped: boolean;
  readonly voice_usage: boolean;
  readonly multilingual_usage: boolean;
  readonly common_fault_patterns: boolean;
  readonly common_repair_patterns: boolean;
  readonly common_pm_failures: boolean;
  readonly common_compliance_issues: boolean;
  readonly asset_health_trends: boolean;
  readonly predictive_accuracy_trends: boolean;
  readonly weights: readonly LearningWeight[];
};
