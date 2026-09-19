import type { AssetManagerImport, AssetManagerImportRow } from "../asset-manager.interface";

export function previewImport(record: AssetManagerImport): {
  readonly created: number;
  readonly updated: number;
  readonly rejected: number;
  readonly warnings: number;
  readonly rows: readonly AssetManagerImportRow[];
} {
  let created = 0;
  let updated = 0;
  let rejected = 0;
  let warnings = 0;
  let index = 0;
  while (index < record.rows.length) {
    const action = record.rows[index].action;
    if (action === "create") {
      created = created + 1;
    }
    if (action === "update") {
      updated = updated + 1;
      warnings = warnings + 1;
    }
    if (action === "reject") {
      rejected = rejected + 1;
    }
    index = index + 1;
  }
  return Object.freeze({
    created,
    updated,
    rejected,
    warnings,
    rows: record.rows,
  });
}

export function importHasRejects(rows: readonly AssetManagerImportRow[]): boolean {
  let index = 0;
  while (index < rows.length) {
    if (rows[index].action === "reject") {
      return true;
    }
    index = index + 1;
  }
  return false;
}
