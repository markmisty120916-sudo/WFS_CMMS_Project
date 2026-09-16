/**
 * AIMI Output Normalizer
 * Master Blueprint V2 / aimi.md §12 / RBAC / TENANT-ISOLATION
 * Seals pipeline output. Does not rewrite engine payloads. No RBAC bypass.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type { ErrorType } from "../../core/errors/error-types";
import type { AimiEngineName } from "../core/aimi-core-engine-map";
import { isEngineAllowedForRole } from "../core/aimi-core-rules";
import type { AimiCoreOutput } from "../core/aimi-core-output.interface";
import { containsEngine } from "../context/aimi-context-rules";
import { enginesInFrozenOrder } from "../pipeline/aimi-pipeline-rules";

export type TenantScoped = {
  readonly tenant_id: string;
};

export function outputSlotTenantError(
  tenant_id: string,
  slot: TenantScoped | null,
): ErrorType | "none" {
  if (slot === null) {
    return "none";
  }
  if (slot.tenant_id !== tenant_id) {
    return "tenant_id mismatch";
  }
  return "none";
}

export function outputSlotRoleError(
  role: DtoRole,
  engine: AimiEngineName,
  slot: TenantScoped | null,
): ErrorType | "none" {
  if (slot === null) {
    return "none";
  }
  if (isEngineAllowedForRole(engine, role) === false) {
    return "role unauthorized";
  }
  return "none";
}

export function outputEngineSlotError(
  engines_run: readonly AimiEngineName[],
  engine: AimiEngineName,
  slot: TenantScoped | null,
): ErrorType | "none" {
  if (containsEngine(engines_run, engine) === false) {
    return "none";
  }
  if (slot === null) {
    return "dto invalid";
  }
  return "none";
}

export function pipelineOutputIdentityError(
  tenant_id: string,
  user_id: string,
  role: DtoRole,
  event_id: string,
  event_type: string,
  output: AimiCoreOutput,
): ErrorType | "none" {
  if (output.tenant_id !== tenant_id) {
    return "tenant_id mismatch";
  }
  if (output.user_id !== user_id) {
    return "dto invalid";
  }
  if (output.role !== role) {
    return "role unauthorized";
  }
  if (output.event_id !== event_id) {
    return "dto invalid";
  }
  if (output.event_type !== event_type) {
    return "event_type invalid";
  }
  if (enginesInFrozenOrder(output.engines_run) === false) {
    return "dto invalid";
  }
  return "none";
}

export function sealedOutputError(
  tenant_id: string,
  user_id: string,
  role: DtoRole,
  event_id: string,
  event_type: string,
  output: AimiCoreOutput,
): ErrorType | "none" {
  const identity = pipelineOutputIdentityError(
    tenant_id,
    user_id,
    role,
    event_id,
    event_type,
    output,
  );
  if (identity !== "none") {
    return identity;
  }

  const severity_tenant = outputSlotTenantError(tenant_id, output.severity);
  if (severity_tenant !== "none") {
    return severity_tenant;
  }
  const routing_tenant = outputSlotTenantError(tenant_id, output.routing);
  if (routing_tenant !== "none") {
    return routing_tenant;
  }
  const scheduling_tenant = outputSlotTenantError(tenant_id, output.scheduling);
  if (scheduling_tenant !== "none") {
    return scheduling_tenant;
  }
  const predictive_tenant = outputSlotTenantError(tenant_id, output.predictive);
  if (predictive_tenant !== "none") {
    return predictive_tenant;
  }
  const diagnostics_tenant = outputSlotTenantError(tenant_id, output.diagnostics);
  if (diagnostics_tenant !== "none") {
    return diagnostics_tenant;
  }
  const learning_tenant = outputSlotTenantError(tenant_id, output.learning);
  if (learning_tenant !== "none") {
    return learning_tenant;
  }
  const multilingual_tenant = outputSlotTenantError(tenant_id, output.multilingual);
  if (multilingual_tenant !== "none") {
    return multilingual_tenant;
  }
  const voice_tenant = outputSlotTenantError(tenant_id, output.voice);
  if (voice_tenant !== "none") {
    return voice_tenant;
  }

  const severity_role = outputSlotRoleError(role, "SeverityEngine", output.severity);
  if (severity_role !== "none") {
    return severity_role;
  }
  const routing_role = outputSlotRoleError(role, "RoutingEngine", output.routing);
  if (routing_role !== "none") {
    return routing_role;
  }
  const scheduling_role = outputSlotRoleError(role, "SchedulingEngine", output.scheduling);
  if (scheduling_role !== "none") {
    return scheduling_role;
  }
  const predictive_role = outputSlotRoleError(role, "PredictiveEngine", output.predictive);
  if (predictive_role !== "none") {
    return predictive_role;
  }
  const diagnostics_role = outputSlotRoleError(role, "DiagnosticEngine", output.diagnostics);
  if (diagnostics_role !== "none") {
    return diagnostics_role;
  }
  const learning_role = outputSlotRoleError(role, "LearningEngine", output.learning);
  if (learning_role !== "none") {
    return learning_role;
  }
  const multilingual_role = outputSlotRoleError(role, "MultilingualNlpEngine", output.multilingual);
  if (multilingual_role !== "none") {
    return multilingual_role;
  }
  const voice_role = outputSlotRoleError(role, "VoiceNlpEngine", output.voice);
  if (voice_role !== "none") {
    return voice_role;
  }

  const severity_slot = outputEngineSlotError(output.engines_run, "SeverityEngine", output.severity);
  if (severity_slot !== "none") {
    return severity_slot;
  }
  const routing_slot = outputEngineSlotError(output.engines_run, "RoutingEngine", output.routing);
  if (routing_slot !== "none") {
    return routing_slot;
  }
  const scheduling_slot = outputEngineSlotError(output.engines_run, "SchedulingEngine", output.scheduling);
  if (scheduling_slot !== "none") {
    return scheduling_slot;
  }
  const predictive_slot = outputEngineSlotError(output.engines_run, "PredictiveEngine", output.predictive);
  if (predictive_slot !== "none") {
    return predictive_slot;
  }
  const diagnostics_slot = outputEngineSlotError(output.engines_run, "DiagnosticEngine", output.diagnostics);
  if (diagnostics_slot !== "none") {
    return diagnostics_slot;
  }
  const learning_slot = outputEngineSlotError(output.engines_run, "LearningEngine", output.learning);
  if (learning_slot !== "none") {
    return learning_slot;
  }
  const multilingual_slot = outputEngineSlotError(
    output.engines_run,
    "MultilingualNlpEngine",
    output.multilingual,
  );
  if (multilingual_slot !== "none") {
    return multilingual_slot;
  }
  const voice_slot = outputEngineSlotError(output.engines_run, "VoiceNlpEngine", output.voice);
  if (voice_slot !== "none") {
    return voice_slot;
  }

  return "none";
}
