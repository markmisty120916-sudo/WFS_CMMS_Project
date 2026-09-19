/**
 * DatabaseModule — Core
 * Master Blueprint V2 / BACKEND-STRUCTURE §4
 * Factory only. No Nest runtime. No global pool or client.
 */

import { DatabaseService } from "./database.service";
import type { DatabaseServiceOptions } from "./database.interface";

export class DatabaseModule {
  static create(options: DatabaseServiceOptions): DatabaseService {
    return new DatabaseService(options);
  }
}

export { DatabaseService } from "./database.service";
export type { DatabaseServiceOptions } from "./database.interface";
export type {
  Database,
  DatabaseConfig,
  DatabaseQueryResult,
  DatabaseRbacHook,
  PostgresConnection,
  PostgresDriver,
} from "./database.interface";
export type { DatabaseContext, DatabaseRole } from "./database-context";
export { ConnectionPool } from "./connection-pool";
export { createPostgresConnection, requireDatabaseConfig } from "./connection-factory";
export {
  createPreparedStatement,
  requireSoftDeleteStatement,
  requireTenantBoundStatement,
} from "./prepared-statement";
export type { PreparedStatement } from "./prepared-statement";
