/**
 * AIMI Output Normalizer
 * Master Blueprint V2 / aimi.md §12 / EVENT-BUS-SPEC §8 / TENANT-ISOLATION
 * Immutable envelope. Engine outputs are sealed, not rewritten.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type { AimiCoreOutput } from "../core/aimi-core-output.interface";
import type { AimiEngineName } from "../core/aimi-core-engine-map";

export type AimiInsightType = "technician" | "fleet" | "asset";
export type AimiInsightSeverity = "Low" | "Medium" | "High" | "Critical";

export type AimiNormalizedOutput = {
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
  readonly timestamp: string;
  readonly session_id: string;
  readonly event_id: string;
  readonly event_type: string;
  readonly engines_ordered: readonly AimiEngineName[];
  readonly engines_run: readonly AimiEngineName[];
  readonly output: AimiCoreOutput;
  readonly insight_type: AimiInsightType;
  readonly insight_severity: AimiInsightSeverity;
  readonly impact_area: string;
};

export function freezeAimiNormalizedOutput(
  envelope: AimiNormalizedOutput,
): AimiNormalizedOutput {
  const ordered: AimiEngineName[] = [];
  let index = 0;
  while (index < envelope.engines_ordered.length) {
    ordered.push(envelope.engines_ordered[index]);
    index = index + 1;
  }
  const run: AimiEngineName[] = [];
  index = 0;
  while (index < envelope.engines_run.length) {
    run.push(envelope.engines_run[index]);
    index = index + 1;
  }
  return Object.freeze({
    tenant_id: envelope.tenant_id,
    user_id: envelope.user_id,
    role: envelope.role,
    timestamp: envelope.timestamp,
    session_id: envelope.session_id,
    event_id: envelope.event_id,
    event_type: envelope.event_type,
    engines_ordered: Object.freeze(ordered),
    engines_run: Object.freeze(run),
    output: envelope.output,
    insight_type: envelope.insight_type,
    insight_severity: envelope.insight_severity,
    impact_area: envelope.impact_area,
  });
}
