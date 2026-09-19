/**
 * DatabaseModule — Core
 * Master Blueprint V2 / DATABASE-SCHEMA §1 / TENANT-ISOLATION §3
 * Prepared statements only. $1 is always tenant_id.
 */

export type PreparedStatement = {
  text: string;
  values: readonly unknown[];
};

export function createPreparedStatement(
  text: string,
  values: readonly unknown[],
): PreparedStatement {
  if (text === "") {
    throw new Error("prepared statement required");
  }
  if (text.indexOf("${") !== -1) {
    throw new Error("prepared statement required");
  }
  if (text.indexOf("$1") === -1) {
    throw new Error("prepared statement required");
  }
  if (values.length < 1) {
    throw new Error("tenant_id required");
  }

  return {
    text,
    values,
  };
}

export function requireTenantBoundStatement(
  statement: PreparedStatement,
  tenant_id: string,
): void {
  if (tenant_id === "") {
    throw new Error("tenant_id required");
  }
  if (statement.values[0] !== tenant_id) {
    throw new Error("tenant_id mismatch");
  }
}

export function requireSoftDeleteStatement(statement: PreparedStatement): void {
  const text = statement.text;
  if (text.indexOf("DELETE FROM") === -1) {
    if (text.indexOf("delete from") === -1) {
      return;
    }
  }
  if (text.indexOf("deleted_at") === -1) {
    throw new Error("soft delete required");
  }
}
