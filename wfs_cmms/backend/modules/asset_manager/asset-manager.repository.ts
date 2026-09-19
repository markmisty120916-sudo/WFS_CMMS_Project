import { createPreparedStatement } from "@/database/prepared-statement";
import type { Database } from "@/database/database.interface";
import type {
  AssetManagerConfigPack,
  AssetManagerDataType,
  AssetManagerFileFormat,
  AssetManagerImport,
  AssetManagerImportRow,
  AssetManagerImportStatus,
  AssetManagerVendorRecord,
} from "./asset-manager.interface";

function asString(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  return value;
}

function asNullable(value: unknown): string | null {
  if (value === null) {
    return null;
  }
  if (typeof value !== "string") {
    return null;
  }
  if (value === "") {
    return null;
  }
  return value;
}

export function serializeImportRows(rows: readonly AssetManagerImportRow[]): string {
  return JSON.stringify(rows);
}

export function parseImportRows(raw: string, tenant_id: string): readonly AssetManagerImportRow[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) === false) {
      return [];
    }
    const rows: AssetManagerImportRow[] = [];
    let index = 0;
    while (index < parsed.length) {
      const item = parsed[index];
      if (item !== null && typeof item === "object" && Array.isArray(item) === false) {
        const record = item as Record<string, unknown>;
        const payloadRaw = record.payload;
        const payload: Record<string, string> = {};
        if (payloadRaw !== null && typeof payloadRaw === "object" && Array.isArray(payloadRaw) === false) {
          const source = payloadRaw as Record<string, unknown>;
          const keys = Object.keys(source);
          let keyIndex = 0;
          while (keyIndex < keys.length) {
            payload[keys[keyIndex]] = asString(source[keys[keyIndex]]);
            keyIndex = keyIndex + 1;
          }
        }
        const row_tenant = asString(record.tenant_id);
        if (row_tenant === tenant_id) {
          rows.push(
            Object.freeze({
              tenant_id: row_tenant,
              row_index: asString(record.row_index),
              data_type: asString(record.data_type) as AssetManagerDataType,
              action: asString(record.action) as AssetManagerImportRow["action"],
              reason: asString(record.reason),
              payload: Object.freeze(payload),
            }),
          );
        }
      }
      index = index + 1;
    }
    return rows;
  } catch {
    return [];
  }
}

export function rowToImport(row: Readonly<Record<string, unknown>>): AssetManagerImport | null {
  const tenant_id = asString(row.tenant_id);
  const import_id = asString(row.import_id);
  if (tenant_id === "" || import_id === "") {
    return null;
  }
  return Object.freeze({
    tenant_id,
    import_id,
    data_type: asString(row.data_type) as AssetManagerDataType,
    file_format: asString(row.file_format) as AssetManagerFileFormat,
    status: asString(row.status) as AssetManagerImportStatus,
    created_by: asString(row.created_by),
    created_at: asString(row.created_at),
    updated_at: asString(row.updated_at),
    audit_summary: asString(row.audit_summary),
    rows: parseImportRows(asString(row.row_payload), tenant_id),
  });
}

export function rowToPack(row: Readonly<Record<string, unknown>>): AssetManagerConfigPack | null {
  const tenant_id = asString(row.tenant_id);
  const pack_id = asString(row.pack_id);
  if (tenant_id === "" || pack_id === "") {
    return null;
  }
  return Object.freeze({
    tenant_id,
    pack_id,
    name: asString(row.name),
    pm_template_name: asString(row.pm_template_name),
    interval_miles: asString(row.interval_miles),
    interval_hours: asString(row.interval_hours),
    severity_default: asString(row.severity_default),
    workorder_source: asString(row.workorder_source),
    telematics_fault_code: asString(row.telematics_fault_code),
    telematics_severity: asString(row.telematics_severity),
    created_at: asString(row.created_at),
    updated_at: asString(row.updated_at),
    deleted_at: asNullable(row.deleted_at),
  });
}

export function rowToVendor(row: Readonly<Record<string, unknown>>): AssetManagerVendorRecord | null {
  const tenant_id = asString(row.tenant_id);
  const vendor_id = asString(row.vendor_id);
  if (tenant_id === "" || vendor_id === "") {
    return null;
  }
  return Object.freeze({
    tenant_id,
    vendor_id,
    vendor_name: asString(row.vendor_name),
    location: asString(row.location),
    created_at: asString(row.created_at),
    updated_at: asString(row.updated_at),
    deleted_at: asNullable(row.deleted_at),
  });
}

export async function saveImport(database: Database, record: AssetManagerImport): Promise<void> {
  await database.execute(
    createPreparedStatement(
      "INSERT INTO ImportHistory (import_id, tenant_id, data_type, file_format, status, created_by, audit_summary, row_payload, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $7, $8, $9, $10, NULL) ON CONFLICT (import_id) DO UPDATE SET status = $5, audit_summary = $7, row_payload = $8, updated_at = $10, deleted_at = NULL WHERE ImportHistory.tenant_id = $1",
      [
        record.tenant_id,
        record.import_id,
        record.data_type,
        record.file_format,
        record.status,
        record.created_by,
        record.audit_summary,
        serializeImportRows(record.rows),
        record.created_at,
        record.updated_at,
      ],
    ),
  );
}

export async function loadImport(database: Database, tenant_id: string, import_id: string): Promise<AssetManagerImport | null> {
  const result = await database.execute(
    createPreparedStatement(
      "SELECT import_id, tenant_id, data_type, file_format, status, created_by, audit_summary, row_payload, created_at, updated_at, deleted_at FROM ImportHistory WHERE tenant_id = $1 AND import_id = $2 AND deleted_at IS NULL",
      [tenant_id, import_id],
    ),
  );
  if (result.rows.length === 0) {
    return null;
  }
  return rowToImport(result.rows[0]);
}

export async function listImports(
  database: Database,
  tenant_id: string,
  status: string,
  data_type: string,
): Promise<readonly AssetManagerImport[]> {
  const result = await database.execute(
    createPreparedStatement(
      "SELECT import_id, tenant_id, data_type, file_format, status, created_by, audit_summary, row_payload, created_at, updated_at, deleted_at FROM ImportHistory WHERE tenant_id = $1 AND deleted_at IS NULL",
      [tenant_id],
    ),
  );
  const items: AssetManagerImport[] = [];
  let index = 0;
  while (index < result.rows.length) {
    const mapped = rowToImport(result.rows[index]);
    if (mapped !== null) {
      let include = true;
      if (status !== "" && mapped.status !== status) {
        include = false;
      }
      if (data_type !== "" && mapped.data_type !== data_type) {
        include = false;
      }
      if (include === true) {
        items.push(mapped);
      }
    }
    index = index + 1;
  }
  return items;
}

export async function savePack(database: Database, pack: AssetManagerConfigPack): Promise<void> {
  await database.execute(
    createPreparedStatement(
      "INSERT INTO ConfigurationPacks (pack_id, tenant_id, name, pm_template_name, interval_miles, interval_hours, severity_default, workorder_source, telematics_fault_code, telematics_severity, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NULL) ON CONFLICT (pack_id) DO UPDATE SET name = $3, pm_template_name = $4, interval_miles = $5, interval_hours = $6, severity_default = $7, workorder_source = $8, telematics_fault_code = $9, telematics_severity = $10, updated_at = $12, deleted_at = NULL WHERE ConfigurationPacks.tenant_id = $1",
      [
        pack.tenant_id,
        pack.pack_id,
        pack.name,
        pack.pm_template_name,
        pack.interval_miles,
        pack.interval_hours,
        pack.severity_default,
        pack.workorder_source,
        pack.telematics_fault_code,
        pack.telematics_severity,
        pack.created_at,
        pack.updated_at,
      ],
    ),
  );
}

export async function loadPack(database: Database, tenant_id: string, pack_id: string): Promise<AssetManagerConfigPack | null> {
  const result = await database.execute(
    createPreparedStatement(
      "SELECT pack_id, tenant_id, name, pm_template_name, interval_miles, interval_hours, severity_default, workorder_source, telematics_fault_code, telematics_severity, created_at, updated_at, deleted_at FROM ConfigurationPacks WHERE tenant_id = $1 AND pack_id = $2 AND deleted_at IS NULL",
      [tenant_id, pack_id],
    ),
  );
  if (result.rows.length === 0) {
    return null;
  }
  return rowToPack(result.rows[0]);
}

export async function listPacks(database: Database, tenant_id: string): Promise<readonly AssetManagerConfigPack[]> {
  const result = await database.execute(
    createPreparedStatement(
      "SELECT pack_id, tenant_id, name, pm_template_name, interval_miles, interval_hours, severity_default, workorder_source, telematics_fault_code, telematics_severity, created_at, updated_at, deleted_at FROM ConfigurationPacks WHERE tenant_id = $1 AND deleted_at IS NULL",
      [tenant_id],
    ),
  );
  const items: AssetManagerConfigPack[] = [];
  let index = 0;
  while (index < result.rows.length) {
    const mapped = rowToPack(result.rows[index]);
    if (mapped !== null) {
      items.push(mapped);
    }
    index = index + 1;
  }
  return items;
}

export async function saveVendor(database: Database, vendor: AssetManagerVendorRecord): Promise<void> {
  await database.execute(
    createPreparedStatement(
      "INSERT INTO Vendors (vendor_id, tenant_id, vendor_name, location, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, NULL) ON CONFLICT (vendor_id) DO UPDATE SET vendor_name = $3, location = $4, updated_at = $6, deleted_at = NULL WHERE Vendors.tenant_id = $1",
      [vendor.tenant_id, vendor.vendor_id, vendor.vendor_name, vendor.location, vendor.created_at, vendor.updated_at],
    ),
  );
}

export async function listVendors(database: Database, tenant_id: string): Promise<readonly AssetManagerVendorRecord[]> {
  const result = await database.execute(
    createPreparedStatement(
      "SELECT vendor_id, tenant_id, vendor_name, location, created_at, updated_at, deleted_at FROM Vendors WHERE tenant_id = $1 AND deleted_at IS NULL",
      [tenant_id],
    ),
  );
  const items: AssetManagerVendorRecord[] = [];
  let index = 0;
  while (index < result.rows.length) {
    const mapped = rowToVendor(result.rows[index]);
    if (mapped !== null) {
      items.push(mapped);
    }
    index = index + 1;
  }
  return items;
}

export async function softDeleteVendor(database: Database, tenant_id: string, vendor_id: string, timestamp: string): Promise<void> {
  await database.execute(
    createPreparedStatement(
      "UPDATE Vendors SET deleted_at = $3, updated_at = $3 WHERE tenant_id = $1 AND vendor_id = $2 AND deleted_at IS NULL",
      [tenant_id, vendor_id, timestamp],
    ),
  );
}

export async function listExistingKeys(
  database: Database,
  tenant_id: string,
  sql: string,
  field: string,
): Promise<readonly string[]> {
  const result = await database.execute(createPreparedStatement(sql, [tenant_id]));
  const keys: string[] = [];
  let index = 0;
  while (index < result.rows.length) {
    const value = asString(result.rows[index][field]).toUpperCase();
    if (value !== "") {
      keys.push(value);
    }
    index = index + 1;
  }
  return keys;
}
