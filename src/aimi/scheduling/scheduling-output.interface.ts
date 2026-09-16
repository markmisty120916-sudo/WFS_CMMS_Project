/**
 * AIMI Scheduling Engine
 * Master Blueprint V2 / AIMI-SCHEDULING §11
 * Immutable scheduling output. All required fields present.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type { SchedulingInputs } from "./scheduling-inputs.interface";

export type SchedulingOutput = {
  readonly scheduled_start: string;
  readonly scheduled_end: string;
  readonly technician_id: string;
  readonly bay_id: string;
  readonly scheduling_reason: string;
  readonly scheduling_inputs: SchedulingInputs;
  readonly scheduling_timestamp: string;
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
};

export function freezeSchedulingOutput(output: SchedulingOutput): SchedulingOutput {
  return Object.freeze({
    scheduled_start: output.scheduled_start,
    scheduled_end: output.scheduled_end,
    technician_id: output.technician_id,
    bay_id: output.bay_id,
    scheduling_reason: output.scheduling_reason,
    scheduling_inputs: output.scheduling_inputs,
    scheduling_timestamp: output.scheduling_timestamp,
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
  });
}
