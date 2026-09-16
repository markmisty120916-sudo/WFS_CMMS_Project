/**
 * AIMI Severity Engine
 * Master Blueprint V2 / AIMI-SEVERITY §6
 * Immutable severity output. All required fields present.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type { SeverityInputs } from "./severity-inputs.interface";
import type { SeverityLevel } from "./severity-levels";

export type SeverityOutput = {
  readonly severity: SeverityLevel;
  readonly reason: string;
  readonly inputs: SeverityInputs;
  readonly timestamp: string;
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
};

export function freezeSeverityOutput(output: SeverityOutput): SeverityOutput {
  return Object.freeze({
    severity: output.severity,
    reason: output.reason,
    inputs: output.inputs,
    timestamp: output.timestamp,
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
  });
}
