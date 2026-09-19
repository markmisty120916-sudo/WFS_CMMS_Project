import { createPreparedStatement } from "@/database/prepared-statement";
import type { Database } from "@/database/database.interface";
import type { ContextDto } from "@/dto/context.dto";
import type { AssetManagerImport, AssetManagerImportRow } from "../asset-manager.interface";
import { mapAuthorizedEmployeeRole } from "../asset-manager-rules";
import { importHasRejects } from "./bulk-preview.engine";

export async function commitImportRows(
  database: Database,
  dto: ContextDto,
  record: AssetManagerImport,
): Promise<{ readonly committed: boolean; readonly reason: string }> {
  if (record.tenant_id !== dto.tenant_id) {
    return Object.freeze({ committed: false, reason: "tenant_id mismatch" });
  }
  if (importHasRejects(record.rows) === true) {
    return Object.freeze({ committed: false, reason: "rows rejected" });
  }
  let index = 0;
  const written: AssetManagerImportRow[] = [];
  while (index < record.rows.length) {
    const row = record.rows[index];
    const ok = await persistRow(database, dto, record, row);
    if (ok === false) {
      await compensate(database, dto, record, written);
      return Object.freeze({ committed: false, reason: "commit failed" });
    }
    written.push(row);
    index = index + 1;
  }
  return Object.freeze({ committed: true, reason: "committed" });
}

async function persistRow(
  database: Database,
  dto: ContextDto,
  record: AssetManagerImport,
  row: AssetManagerImportRow,
): Promise<boolean> {
  const vin = (row.payload.vin || "").toUpperCase();
  if (record.data_type === "vehicles") {
    if (row.action === "update") {
      return run(
        database,
        "UPDATE Assets SET unit_number = $3, make = $4, model = $5, year = $6, mileage = $7, hours = $8, status = $9, telematics_id = $10, vendor_id = $11, updated_at = $12 WHERE tenant_id = $1 AND vin = $2 AND deleted_at IS NULL",
        [
          dto.tenant_id,
          vin,
          row.payload.unit_number || "",
          row.payload.make || "",
          row.payload.model || "",
          row.payload.year || "",
          row.payload.mileage || "",
          row.payload.hours || "",
          row.payload.status || "",
          row.payload.telematics_id || "",
          row.payload.vendor_id || "",
          dto.timestamp,
        ],
      );
    }
    const asset_id = row.payload.asset_id || vin;
    return run(
      database,
      "INSERT INTO Assets (asset_id, tenant_id, vin, unit_number, make, model, year, mileage, hours, status, telematics_id, vendor_id, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $13, NULL)",
      [
        dto.tenant_id,
        asset_id,
        vin,
        row.payload.unit_number || "",
        row.payload.make || "",
        row.payload.model || "",
        row.payload.year || "",
        row.payload.mileage || "",
        row.payload.hours || "",
        row.payload.status || "",
        row.payload.telematics_id || "",
        row.payload.vendor_id || "",
        dto.timestamp,
      ],
    );
  }
  if (record.data_type === "parts") {
    const part_id = row.payload.part_id || row.payload.name || row.row_index;
    if (row.action === "update") {
      return run(
        database,
        "UPDATE Parts SET description = $3, quantity = $4, location = $5, reorder_point = $6, vendor_id = $7, updated_at = $8 WHERE tenant_id = $1 AND name = $2 AND deleted_at IS NULL",
        [
          dto.tenant_id,
          row.payload.name || "",
          row.payload.description || "",
          row.payload.quantity || "",
          row.payload.location || "",
          row.payload.reorder_point || "",
          row.payload.vendor_id || "",
          dto.timestamp,
        ],
      );
    }
    return run(
      database,
      "INSERT INTO Parts (part_id, tenant_id, name, description, quantity, location, reorder_point, vendor_id, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $7, $8, $9, $9, NULL)",
      [
        dto.tenant_id,
        part_id,
        row.payload.name || "",
        row.payload.description || "",
        row.payload.quantity || "",
        row.payload.location || "",
        row.payload.reorder_point || "",
        row.payload.vendor_id || "",
        dto.timestamp,
      ],
    );
  }
  if (record.data_type === "employees") {
    const user_id = row.payload.user_id || row.payload.email || row.row_index;
    const role = mapAuthorizedEmployeeRole(row.payload.role || "");
    if (role === null) {
      return false;
    }
    if (row.action === "update") {
      return run(
        database,
        "UPDATE Users SET name = $3, role = $4, status = $5, updated_at = $6 WHERE tenant_id = $1 AND email = $2 AND deleted_at IS NULL",
        [dto.tenant_id, row.payload.email || "", row.payload.name || "", role, row.payload.status || "", dto.timestamp],
      );
    }
    return run(
      database,
      "INSERT INTO Users (user_id, tenant_id, name, email, role, status, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $7, $7, NULL)",
      [dto.tenant_id, user_id, row.payload.name || "", row.payload.email || "", role, row.payload.status || "", dto.timestamp],
    );
  }
  if (record.data_type === "pms") {
    const template_id = row.payload.pm_template_id || row.payload.name || row.row_index;
    const templateOk = await run(
      database,
      "INSERT INTO PMTemplates (pm_template_id, tenant_id, name, interval_miles, interval_hours, asset_group, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $7, $7, NULL)",
      [
        dto.tenant_id,
        template_id,
        row.payload.name || "",
        row.payload.interval_miles || "",
        row.payload.interval_hours || "",
        row.payload.asset_group || "",
        dto.timestamp,
      ],
    );
    if (templateOk === false) {
      return false;
    }
    const schedule_id = row.payload.pm_schedule_id || template_id;
    return run(
      database,
      "INSERT INTO PMSchedule (pm_schedule_id, tenant_id, asset_id, pm_template_id, due_miles, due_hours, status, asset_group, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $7, $8, $9, $9, NULL)",
      [
        dto.tenant_id,
        schedule_id,
        row.payload.asset_id || "",
        template_id,
        row.payload.due_miles || "",
        row.payload.due_hours || "",
        row.payload.status || "",
        row.payload.asset_group || "",
        dto.timestamp,
      ],
    );
  }
  if (record.data_type === "vendors") {
    const vendor_id = row.payload.vendor_id || row.payload.vendor_name || row.row_index;
    return run(
      database,
      "INSERT INTO Vendors (vendor_id, tenant_id, vendor_name, location, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $5, NULL)",
      [dto.tenant_id, vendor_id, row.payload.vendor_name || "", row.payload.location || "", dto.timestamp],
    );
  }
  if (record.data_type === "config_packs") {
    const pack_id = row.payload.pack_id || row.row_index;
    const packOk = await run(
      database,
      "INSERT INTO ConfigurationPacks (pack_id, tenant_id, name, pm_template_name, interval_miles, interval_hours, severity_default, workorder_source, telematics_fault_code, telematics_severity, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11, NULL)",
      [
        dto.tenant_id,
        pack_id,
        row.payload.name || "",
        row.payload.pm_template_name || "",
        row.payload.interval_miles || "",
        row.payload.interval_hours || "",
        row.payload.severity_default || "",
        row.payload.workorder_source || "",
        row.payload.telematics_fault_code || "",
        row.payload.telematics_severity || "",
        dto.timestamp,
      ],
    );
    if (packOk === false) {
      return false;
    }
    return run(
      database,
      "INSERT INTO PMTemplates (pm_template_id, tenant_id, name, interval_miles, interval_hours, asset_group, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $7, $7, NULL)",
      [
        dto.tenant_id,
        pack_id,
        row.payload.pm_template_name || "",
        row.payload.interval_miles || "",
        row.payload.interval_hours || "",
        row.payload.asset_group || "",
        dto.timestamp,
      ],
    );
  }
  return false;
}

async function compensate(
  database: Database,
  dto: ContextDto,
  record: AssetManagerImport,
  written: readonly AssetManagerImportRow[],
): Promise<void> {
  let index = 0;
  while (index < written.length) {
    const row = written[index];
    if (record.data_type === "vehicles") {
      await run(database, "UPDATE Assets SET deleted_at = $3, updated_at = $3 WHERE tenant_id = $1 AND vin = $2", [
        dto.tenant_id,
        (row.payload.vin || "").toUpperCase(),
        dto.timestamp,
      ]);
    }
    if (record.data_type === "parts") {
      await run(database, "UPDATE Parts SET deleted_at = $3, updated_at = $3 WHERE tenant_id = $1 AND name = $2", [
        dto.tenant_id,
        row.payload.name || "",
        dto.timestamp,
      ]);
    }
    if (record.data_type === "employees") {
      await run(database, "UPDATE Users SET deleted_at = $3, updated_at = $3 WHERE tenant_id = $1 AND email = $2", [
        dto.tenant_id,
        row.payload.email || "",
        dto.timestamp,
      ]);
    }
    if (record.data_type === "vendors") {
      await run(database, "UPDATE Vendors SET deleted_at = $3, updated_at = $3 WHERE tenant_id = $1 AND vendor_name = $2", [
        dto.tenant_id,
        row.payload.vendor_name || "",
        dto.timestamp,
      ]);
    }
    if (record.data_type === "config_packs") {
      await run(database, "UPDATE ConfigurationPacks SET deleted_at = $3, updated_at = $3 WHERE tenant_id = $1 AND pack_id = $2", [
        dto.tenant_id,
        row.payload.pack_id || row.row_index,
        dto.timestamp,
      ]);
    }
    index = index + 1;
  }
}

async function run(database: Database, sql: string, values: readonly unknown[]): Promise<boolean> {
  try {
    await database.execute(createPreparedStatement(sql, values));
    return true;
  } catch {
    return false;
  }
}
