/**
 * DTO Layer — Core
 * Master Blueprint V2 / DATABASE-SCHEMA §2.1
 * Immutable tenant DTO. No dynamic fields.
 */

import { freezeBaseDto, type BaseDto, type DtoRole } from "./base.dto";

export type TenantDto = BaseDto & {
  readonly name: string;
  readonly status: string;
};

export function freezeTenantDto(
  tenant_id: string,
  role: DtoRole,
  timestamp: string,
  name: string,
  status: string,
): TenantDto {
  const base = freezeBaseDto({
    tenant_id,
    role,
    timestamp,
  });
  return Object.freeze({
    tenant_id: base.tenant_id,
    role: base.role,
    timestamp: base.timestamp,
    name,
    status,
  });
}
