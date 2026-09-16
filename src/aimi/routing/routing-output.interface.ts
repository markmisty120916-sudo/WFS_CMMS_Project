/**
 * AIMI Routing Engine
 * Master Blueprint V2 / AIMI-ROUTING §9
 * Immutable routing output. All required fields present.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type { RoutingInputs } from "./routing-inputs.interface";

export type RoutingOutput = {
  readonly technician_id: string;
  readonly bay_id: string;
  readonly routing_reason: string;
  readonly inputs: RoutingInputs;
  readonly routing_timestamp: string;
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
};

export function freezeRoutingOutput(output: RoutingOutput): RoutingOutput {
  return Object.freeze({
    technician_id: output.technician_id,
    bay_id: output.bay_id,
    routing_reason: output.routing_reason,
    inputs: output.inputs,
    routing_timestamp: output.routing_timestamp,
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
  });
}
