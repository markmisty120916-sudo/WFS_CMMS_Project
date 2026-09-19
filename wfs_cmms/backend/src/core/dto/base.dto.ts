/**
 * DTO Layer — Core
 * Master Blueprint V2 / TENANT-ISOLATION §2 / RBAC §2
 * Immutable base DTO. tenant_id, role, and timestamp are required.
 */

export type DtoRole =
  | "DRIVER"
  | "TECHNICIAN"
  | "MASTER TECHNICIAN"
  | "PARTS MANAGER"
  | "FLEET MANAGER"
  | "COMPLIANCE OFFICER"
  | "ADMIN"
  | "SILENT MASTER KEY";

export type BaseDto = {
  readonly tenant_id: string;
  readonly role: DtoRole;
  readonly timestamp: string;
};

export function freezeBaseDto(dto: BaseDto): BaseDto {
  return Object.freeze({
    tenant_id: dto.tenant_id,
    role: dto.role,
    timestamp: dto.timestamp,
  });
}
