/**
 * DTO Layer — Core
 * Master Blueprint V2 / DATABASE-SCHEMA §2.3 / RBAC §2
 * Immutable role DTO. No dynamic fields.
 */

import { freezeBaseDto, type BaseDto, type DtoRole } from "./base.dto";

export type RoleDto = BaseDto & {
  readonly role_id: string;
  readonly role_name: DtoRole;
};

export function freezeRoleDto(
  tenant_id: string,
  role: DtoRole,
  timestamp: string,
  role_id: string,
): RoleDto {
  const base = freezeBaseDto({
    tenant_id,
    role,
    timestamp,
  });
  return Object.freeze({
    tenant_id: base.tenant_id,
    role: base.role,
    timestamp: base.timestamp,
    role_id,
    role_name: base.role,
  });
}
