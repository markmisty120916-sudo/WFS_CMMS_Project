import type { PreparedStatement } from "./prepared-statement";

export type DatabaseQueryResult = {
  rows: readonly Readonly<Record<string, unknown>>[];
  row_count: number;
};

export type Database = {
  execute(statement: PreparedStatement): Promise<DatabaseQueryResult>;
};
