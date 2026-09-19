/**
 * DatabaseModule — Core
 * Master Blueprint V2 / BACKEND-STRUCTURE §4
 * Instance-scoped PostgreSQL pool. Zero process-global state.
 */

import { createPostgresConnection, requireDatabaseConfig } from "./connection-factory";
import type { DatabaseConfig, PostgresConnection, PostgresDriver } from "./database.interface";

export class ConnectionPool {
  private readonly driver: PostgresDriver;
  private readonly config: DatabaseConfig;
  private in_use: number;

  constructor(driver: PostgresDriver, config: DatabaseConfig) {
    requireDatabaseConfig(config);
    this.driver = driver;
    this.config = config;
    this.in_use = 0;
  }

  async acquire(): Promise<PostgresConnection> {
    if (this.in_use >= this.config.max_connections) {
      throw new Error("connection pool exhausted");
    }
    this.in_use = this.in_use + 1;
    return createPostgresConnection(this.driver, this.config);
  }

  release(connection: PostgresConnection): void {
    connection.release();
    if (this.in_use > 0) {
      this.in_use = this.in_use - 1;
    }
  }
}
