import { createPreparedStatement } from "../../../../src/core/database/prepared-statement";
import type { Database } from "../../../../src/core/database/database.interface";

export function asField(row: Readonly<Record<string, unknown>>, key: string): string {
  const value = row[key];
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return String(value);
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return "";
}

export async function listTenantRows(
  database: Database,
  sql: string,
  tenant_id: string,
): Promise<readonly Readonly<Record<string, unknown>>[]> {
  const result = await database.execute(createPreparedStatement(sql, [tenant_id]));
  return result.rows;
}
