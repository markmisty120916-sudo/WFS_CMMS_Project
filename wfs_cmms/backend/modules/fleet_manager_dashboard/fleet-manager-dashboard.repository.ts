import { createPreparedStatement } from "@/database/prepared-statement";
import type { Database } from "@/database/database.interface";

export function asField(row: Readonly<Record<string, unknown>>, key: string): string {
  const value = row[key];
  if (typeof value !== "string") {
    return "";
  }
  return value;
}

export async function listTenantRows(
  database: Database,
  sql: string,
  tenant_id: string,
): Promise<readonly Readonly<Record<string, unknown>>[]> {
  const result = await database.execute(createPreparedStatement(sql, [tenant_id]));
  return result.rows;
}
