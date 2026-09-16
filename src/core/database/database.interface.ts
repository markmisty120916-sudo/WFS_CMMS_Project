/**
 * DatabaseModule — Core
 * Master Blueprint V2 / BACKEND-STRUCTURE §4 / DATABASE-SCHEMA §1
 * PostgreSQL driver contract. No ORM. No raw client export.
 */

import type { ConfigPack } from "../../config/configTypes";
import type { AuditLogHook, Logger } from "../logger/logger.interface";
import type { DatabaseContext } from "./database-context";
import type { PreparedStatement } from "./prepared-statement";

export type DatabaseConfig = {
  host: string;
  port: number;
  database: string;
  user: string;
  ssl: boolean;
  max_connections: number;
};

export type DatabaseQueryResult = {
  rows: readonly Readonly<Record<string, unknown>>[];
  row_count: number;
};

export type PostgresConnection = {
  query(text: string, values: readonly unknown[]): Promise<DatabaseQueryResult>;
  release(): void;
};

export type PostgresDriver = {
  connect(config: DatabaseConfig): Promise<PostgresConnection>;
};

export type DatabaseRbacHook = {
  assert(context: DatabaseContext): void;
};

export type Database = {
  execute(statement: PreparedStatement): Promise<DatabaseQueryResult>;
};

export type DatabaseServiceOptions = {
  context: DatabaseContext;
  configPack: ConfigPack;
  databaseConfig: DatabaseConfig;
  driver: PostgresDriver;
  logger: Logger;
  auditLogHook: AuditLogHook;
  rbacHook: DatabaseRbacHook;
};
