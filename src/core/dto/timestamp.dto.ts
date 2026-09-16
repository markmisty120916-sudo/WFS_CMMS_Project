/**
 * DTO Layer — Core
 * Master Blueprint V2 / DATABASE-SCHEMA §1
 * Immutable timestamp DTO. Soft-delete uses deleted_at.
 */

import { freezeBaseDto, type BaseDto, type DtoRole } from "./base.dto";

export type TimestampDto = BaseDto & {
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export function freezeTimestampDto(
  tenant_id: string,
  role: DtoRole,
  timestamp: string,
  created_at: string,
  updated_at: string,
  deleted_at: string | null,
): TimestampDto {
  const base = freezeBaseDto({
    tenant_id,
    role,
    timestamp,
  });
  return Object.freeze({
    tenant_id: base.tenant_id,
    role: base.role,
    timestamp: base.timestamp,
    created_at,
    updated_at,
    deleted_at,
  });
}
