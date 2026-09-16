/**
 * AIMI Diagnostics Engine
 * Master Blueprint V2 / BACKEND-STRUCTURE §6 / AIMI-DIAGNOSTIC-FLOWS
 * Factory only. No Nest runtime. No global diagnostics instance.
 */

import {
  DiagnosticsEngineService,
  type DiagnosticsEngineServiceOptions,
} from "./diagnostics-engine.service";

export class DiagnosticsEngineModule {
  static create(options: DiagnosticsEngineServiceOptions): DiagnosticsEngineService {
    return new DiagnosticsEngineService(options);
  }
}

export { DiagnosticsEngineService } from "./diagnostics-engine.service";
export type { DiagnosticsEngineServiceOptions } from "./diagnostics-engine.service";
export type {
  DiagnosticFlow,
  DiagnosticInputs,
  DiagnosticPathType,
  DiagnosticStep,
} from "./diagnostics-inputs.interface";
export type { DiagnosticsOutput } from "./diagnostics-output.interface";
export { freezeDiagnosticsOutput } from "./diagnostics-output.interface";
export type { DiagnosticsMatch } from "./diagnostics-decision-tree";
export { evaluateDiagnosticsTree } from "./diagnostics-decision-tree";
export {
  canSkipStep,
  countSymptomSources,
  findFlow,
  findStep,
  isRoleAllowedToDiagnose,
  isStepEligible,
  isStepRecorded,
  nextPendingStep,
  pathFromSymptoms,
  reasonFromPath,
  requiredStepsComplete,
} from "./diagnostics-rules";
export {
  incomingEventFromDiagnosticStepCompleted,
  incomingEventFromDiagnosticStepSkipped,
  incomingEventFromDiagnosticStepStarted,
  incomingEventFromDiagnosticVerification,
} from "./diagnostics-events";
