/**
 * LoggerModule — Core
 * Master Blueprint V2 / TENANT-ISOLATION §2 / RBAC §2
 * Request log context. tenant_id and role are required on every record.
 */

export type LoggerRole =
  | "DRIVER"
  | "TECHNICIAN"
  | "MASTER TECHNICIAN"
  | "PARTS MANAGER"
  | "FLEET MANAGER"
  | "COMPLIANCE OFFICER"
  | "ADMIN"
  | "SILENT MASTER KEY";

export type LoggerContext = {
  tenant_id: string;
  user_id: string;
  role: LoggerRole;
  correlation_id: string;
  timestamp: string;
};
