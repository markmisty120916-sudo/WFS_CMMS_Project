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

export function payloadRecord(row: Readonly<Record<string, unknown>>): Readonly<Record<string, unknown>> {
  const payload = row.payload;
  if (payload !== null && typeof payload === "object" && Array.isArray(payload) === false) {
    return payload as Record<string, unknown>;
  }
  const event_payload = row.event_payload;
  if (event_payload !== null && typeof event_payload === "object" && Array.isArray(event_payload) === false) {
    return event_payload as Record<string, unknown>;
  }
  if (typeof payload === "string") {
    try {
      const parsed: unknown = JSON.parse(payload);
      if (parsed !== null && typeof parsed === "object" && Array.isArray(parsed) === false) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return row;
    }
  }
  return row;
}

export async function listTenantRows(
  database: Database,
  sql: string,
  tenant_id: string,
): Promise<readonly Readonly<Record<string, unknown>>[]> {
  const result = await database.execute(createPreparedStatement(sql, [tenant_id]));
  return result.rows;
}

export async function listAllRows(
  database: Database,
  sql: string,
): Promise<readonly Readonly<Record<string, unknown>>[]> {
  const result = await database.execute(createPreparedStatement(sql, []));
  return result.rows;
}
