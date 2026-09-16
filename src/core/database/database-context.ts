/**
 * DatabaseModule — Core
 * Master Blueprint V2 / TENANT-ISOLATION §2 / RBAC §2
 * Query context. tenant_id and role are required on every statement.
 */

export type DatabaseRole =
  | "DRIVER"
  | "TECHNICIAN"
  | "MASTER TECHNICIAN"
  | "PARTS MANAGER"
  | "FLEET MANAGER"
  | "COMPLIANCE OFFICER"
  | "ADMIN"
  | "SILENT MASTER KEY";

export type DatabaseContext = {
  tenant_id: string;
  user_id: string;
  role: DatabaseRole;
  permission_key: string;
  correlation_id: string;
  timestamp: string;
};
