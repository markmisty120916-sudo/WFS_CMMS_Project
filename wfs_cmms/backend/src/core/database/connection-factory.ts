/**
 * DatabaseModule — Core
 * Master Blueprint V2 / BACKEND-STRUCTURE §4
 * PostgreSQL connection factory. No global connection. No ORM.
 */

import type { DatabaseConfig, PostgresConnection, PostgresDriver } from "./database.interface";

export function requireDatabaseConfig(config: DatabaseConfig): void {
  if (config.host === "") {
    throw new Error("database config required");
  }
  if (config.database === "") {
    throw new Error("database config required");
  }
  if (config.user === "") {
    throw new Error("database config required");
  }
  if (config.port < 1) {
    throw new Error("database config required");
  }
  if (config.max_connections < 1) {
    throw new Error("database config required");
  }
}

export function createPostgresConnection(
  driver: PostgresDriver,
  config: DatabaseConfig,
): Promise<PostgresConnection> {
  requireDatabaseConfig(config);
  return driver.connect(config);
}
