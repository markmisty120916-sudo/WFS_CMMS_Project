/**
 * DatabaseModule — Core
 * Master Blueprint V2 / BACKEND-STRUCTURE §4 / TENANT-ISOLATION §3
 * Deterministic query wrapper. Prepared statements only. No raw client leakage.
 */

import { ConnectionPool } from "./connection-pool";
import type {
  Database,
  DatabaseQueryResult,
  DatabaseServiceOptions,
} from "./database.interface";
import type { DatabaseContext } from "./database-context";
import type { PreparedStatement } from "./prepared-statement";
import { requireSoftDeleteStatement, requireTenantBoundStatement } from "./prepared-statement";

export class DatabaseService implements Database {
  private readonly context: DatabaseContext;
  private readonly pool: ConnectionPool;
  private readonly options: DatabaseServiceOptions;

  constructor(options: DatabaseServiceOptions) {
    if (options.context.tenant_id === "") {
      throw new Error("tenant_id required");
    }
    if (options.context.user_id === "") {
      throw new Error("user_id required");
    }
    if (options.context.timestamp === "") {
      throw new Error("timestamp required");
    }
    if (options.configPack.tenantId !== options.context.tenant_id) {
      throw new Error("tenant_id mismatch");
    }

    options.rbacHook.assert(options.context);

    this.context = {
      tenant_id: options.context.tenant_id,
      user_id: options.context.user_id,
      role: options.context.role,
      permission_key: options.context.permission_key,
      correlation_id: options.context.correlation_id,
      timestamp: options.context.timestamp,
    };
    this.options = options;
    this.pool = new ConnectionPool(options.driver, options.databaseConfig);
  }

  withContext(context: DatabaseContext): DatabaseService {
    return new DatabaseService({
      context,
      configPack: this.options.configPack,
      databaseConfig: this.options.databaseConfig,
      driver: this.options.driver,
      logger: this.options.logger,
      auditLogHook: this.options.auditLogHook,
      rbacHook: this.options.rbacHook,
    });
  }

  async execute(statement: PreparedStatement): Promise<DatabaseQueryResult> {
    this.options.rbacHook.assert(this.context);
    requireTenantBoundStatement(statement, this.context.tenant_id);
    requireSoftDeleteStatement(statement);

    this.options.logger.debug("database.query");
    this.options.auditLogHook.write({
      level: "debug",
      message: "database.query",
      tenant_id: this.context.tenant_id,
      user_id: this.context.user_id,
      role: this.context.role,
      correlation_id: this.context.correlation_id,
      timestamp: this.context.timestamp,
    });

    const connection = await this.pool.acquire();
    try {
      const result = await connection.query(statement.text, statement.values);
      return {
        rows: result.rows,
        row_count: result.row_count,
      };
    } finally {
      this.pool.release(connection);
    }
  }
}
