/**
 * AIMI Diagnostics Engine
 * Master Blueprint V2 / AIMI-DIAGNOSTIC-FLOWS §7 / diagnostics.md §7
 * Strict path selection. Catalog order only. No guessed steps.
 */

import type {
  DiagnosticFlow,
  DiagnosticInputs,
  DiagnosticPathType,
  DiagnosticStep,
} from "./diagnostics-inputs.interface";
import {
  findFlow,
  isStepEligible,
  pathFromSymptoms,
  reasonFromPath,
} from "./diagnostics-rules";

export type DiagnosticsMatch = {
  readonly diagnostic_flow_id: string;
  readonly path: DiagnosticPathType;
  readonly steps: readonly DiagnosticStep[];
  readonly repair_id: string;
  readonly part_id: string;
  readonly labor_id: string;
  readonly reason: string;
};

export function evaluateDiagnosticsTree(inputs: DiagnosticInputs): DiagnosticsMatch | null {
  const path = pathFromSymptoms(inputs);
  if (path === null) {
    return null;
  }

  const selected: DiagnosticStep[] = [];
  let flow_id = "";
  let index = 0;
  while (index < inputs.steps.length) {
    const step = inputs.steps[index];
    index = index + 1;
    if (step.path !== path) {
      continue;
    }
    if (isStepEligible(step, inputs, path) === false) {
      if (step.safety_required === true) {
        if (step.tenant_id === inputs.tenant_id) {
          return null;
        }
      }
      continue;
    }
    if (flow_id === "") {
      flow_id = step.diagnostic_flow_id;
    }
    if (step.diagnostic_flow_id !== flow_id) {
      continue;
    }
    selected.push(step);
  }
  if (flow_id === "") {
    return null;
  }
  if (selected.length === 0) {
    return null;
  }

  const flow: DiagnosticFlow | null = findFlow(inputs.flows, flow_id, inputs.tenant_id, path);
  if (flow === null) {
    return null;
  }

  return {
    diagnostic_flow_id: flow.diagnostic_flow_id,
    path,
    steps: selected,
    repair_id: flow.repair_id,
    part_id: flow.part_id,
    labor_id: flow.labor_id,
    reason: reasonFromPath(path),
  };
}
