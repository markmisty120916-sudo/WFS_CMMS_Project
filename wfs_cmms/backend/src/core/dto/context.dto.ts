import type { BaseDto, DtoRole } from "@/dto/base.dto";

export type ContextDto = BaseDto & {
  user_id?: string;
  role?: DtoRole;
  timestamp?: string;
  correlation_id?: string;
  rule_id?: string;
  lifecycle_kind?: string;
  from_state?: string;
  to_state?: string;
  entity_id?: string;
};

export function freezeContextDto(
  tenant_id: string,
  role: DtoRole,
  timestamp: string,
  user_id: string,
  correlation_id: string,
  rule_id: string,
  lifecycle_kind: string,
  from_state: string,
  to_state: string,
  entity_id: string,
): ContextDto {
  return {
    tenant_id,
    role,
    timestamp,
    user_id,
    correlation_id,
    rule_id,
    lifecycle_kind,
    from_state,
    to_state,
    entity_id,
  };
}
