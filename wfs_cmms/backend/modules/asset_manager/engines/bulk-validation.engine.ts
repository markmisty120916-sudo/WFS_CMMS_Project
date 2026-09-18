import type { AssetManagerDataType, AssetManagerImportRow, AssetManagerRowAction } from "../asset-manager.interface";
import { isPmIntervalSane, isSeverityLevel, isVinFormat, mapAuthorizedEmployeeRole } from "../asset-manager-rules";

function field(row: Readonly<Record<string, string>>, key: string): string {
  const value = row[key];
  if (value === undefined) {
    return "";
  }
  return value.trim();
}

export function validateImportRow(
  tenant_id: string,
  data_type: AssetManagerDataType,
  row_index: string,
  row: Readonly<Record<string, string>>,
  seen_keys: readonly string[],
): AssetManagerImportRow {
  let action: AssetManagerRowAction = "create";
  let reason = "";
  if (data_type === "vehicles") {
    const vin = field(row, "vin").toUpperCase();
    if (vin === "") {
      action = "reject";
      reason = "vin required";
    } else if (isVinFormat(vin) === false) {
      action = "reject";
      reason = "vin format invalid";
    } else if (field(row, "unit_number") === "" || field(row, "make") === "" || field(row, "model") === "" || field(row, "year") === "") {
      action = "reject";
      reason = "required fields missing";
    } else {
      let seen = false;
      let index = 0;
      while (index < seen_keys.length) {
        if (seen_keys[index] === vin) {
          seen = true;
        }
        index = index + 1;
      }
      if (seen === true) {
        action = "update";
        reason = "duplicate vin";
      } else {
        reason = "aimi vin valid";
      }
    }
  }
  if (data_type === "parts") {
    if (field(row, "name") === "" || field(row, "quantity") === "") {
      action = "reject";
      reason = "required fields missing";
    } else {
      reason = "part ready";
    }
  }
  if (data_type === "employees") {
    const role = mapAuthorizedEmployeeRole(field(row, "role"));
    if (field(row, "name") === "" || field(row, "email") === "") {
      action = "reject";
      reason = "required fields missing";
    } else if (role === null) {
      action = "reject";
      reason = "role invalid";
    } else {
      reason = "role valid";
    }
  }
  if (data_type === "pms") {
    if (field(row, "asset_id") === "" || field(row, "name") === "") {
      action = "reject";
      reason = "required fields missing";
    } else if (isPmIntervalSane(field(row, "interval_miles"), field(row, "interval_hours")) === false) {
      action = "reject";
      reason = "pm interval invalid";
    } else {
      reason = "aimi pm interval valid";
    }
  }
  if (data_type === "vendors") {
    if (field(row, "vendor_name") === "") {
      action = "reject";
      reason = "vendor_name required";
    } else {
      reason = "vendor ready";
    }
  }
  if (data_type === "config_packs") {
    if (field(row, "name") === "" || field(row, "pm_template_name") === "") {
      action = "reject";
      reason = "required fields missing";
    } else if (isPmIntervalSane(field(row, "interval_miles"), field(row, "interval_hours")) === false) {
      action = "reject";
      reason = "pm interval invalid";
    } else if (isSeverityLevel(field(row, "severity_default")) === false) {
      action = "reject";
      reason = "severity threshold invalid";
    } else if (field(row, "telematics_severity") !== "" && isSeverityLevel(field(row, "telematics_severity")) === false) {
      action = "reject";
      reason = "telematics mapping invalid";
    } else {
      reason = "aimi configuration pack valid";
    }
  }
  return Object.freeze({
    tenant_id,
    row_index,
    data_type,
    action,
    reason,
    payload: row,
  });
}

export function validateImportRows(
  tenant_id: string,
  data_type: AssetManagerDataType,
  rows: readonly Readonly<Record<string, string>>[],
): readonly AssetManagerImportRow[] {
  const validated: AssetManagerImportRow[] = [];
  const seen: string[] = [];
  let index = 0;
  while (index < rows.length) {
    const row = rows[index];
    const result = validateImportRow(tenant_id, data_type, String(index + 1), row, seen);
    if (data_type === "vehicles") {
      const vin = (row.vin === undefined ? "" : row.vin).trim().toUpperCase();
      if (vin !== "") {
        seen.push(vin);
      }
    }
    validated.push(result);
    index = index + 1;
  }
  return validated;
}

export function applyExistingDuplicateKeys(
  rows: readonly AssetManagerImportRow[],
  existing_keys: readonly string[],
  key_field: string,
): readonly AssetManagerImportRow[] {
  const next: AssetManagerImportRow[] = [];
  let index = 0;
  while (index < rows.length) {
    const row = rows[index];
    if (row.action === "create") {
      const key = (row.payload[key_field] || "").trim().toUpperCase();
      let found = false;
      let existingIndex = 0;
      while (existingIndex < existing_keys.length) {
        if (existing_keys[existingIndex] === key) {
          found = true;
        }
        existingIndex = existingIndex + 1;
      }
      if (found === true && key !== "") {
        next.push(
          Object.freeze({
            ...row,
            action: "update",
            reason: "duplicate " + key_field,
          }),
        );
      } else {
        next.push(row);
      }
    } else {
      next.push(row);
    }
    index = index + 1;
  }
  return next;
}
