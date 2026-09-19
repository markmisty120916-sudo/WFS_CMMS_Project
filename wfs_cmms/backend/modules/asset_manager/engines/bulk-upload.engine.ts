import type { AssetManagerColumnMap, AssetManagerDataType, AssetManagerFileFormat } from "../asset-manager.interface";

export function parseDelimitedRows(content: string, delimiter: string): readonly Readonly<Record<string, string>>[] {
  const lines = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const headerLine = lines.length > 0 ? lines[0] : "";
  if (headerLine.trim() === "") {
    return [];
  }
  const headers = headerLine.split(delimiter);
  const rows: Readonly<Record<string, string>>[] = [];
  let lineIndex = 1;
  while (lineIndex < lines.length) {
    const line = lines[lineIndex];
    if (line.trim() !== "") {
        const values = line.split(delimiter);
      const record: Record<string, string> = {};
      let col = 0;
      while (col < headers.length) {
        const key = headers[col].trim();
        const value = col < values.length ? values[col].trim() : "";
        record[key] = value;
        col = col + 1;
      }
      rows.push(Object.freeze(record));
    }
    lineIndex = lineIndex + 1;
  }
  return rows;
}

export function parseJsonRows(content: string): readonly Readonly<Record<string, string>>[] {
  try {
    const parsed: unknown = JSON.parse(content);
    if (Array.isArray(parsed) === false) {
      return [];
    }
    const rows: Readonly<Record<string, string>>[] = [];
    let index = 0;
    while (index < parsed.length) {
      const item = parsed[index];
      if (item !== null && typeof item === "object" && Array.isArray(item) === false) {
        const source = item as Record<string, unknown>;
        const record: Record<string, string> = {};
        const keys = Object.keys(source);
        let keyIndex = 0;
        while (keyIndex < keys.length) {
          const key = keys[keyIndex];
          const value = source[key];
          record[key] = typeof value === "string" ? value.trim() : String(value);
          keyIndex = keyIndex + 1;
        }
        rows.push(Object.freeze(record));
      }
      index = index + 1;
    }
    return rows;
  } catch {
    return [];
  }
}

export function parseUploadRows(file_format: AssetManagerFileFormat, content: string): readonly Readonly<Record<string, string>>[] {
  if (file_format === "json") {
    return parseJsonRows(content);
  }
  if (file_format === "xlsx") {
    return parseDelimitedRows(content, "\t");
  }
  return parseDelimitedRows(content, ",");
}

export function applyColumnMap(
  row: Readonly<Record<string, string>>,
  column_map: readonly AssetManagerColumnMap[],
): Readonly<Record<string, string>> {
  const mapped: Record<string, string> = {};
  const keys = Object.keys(row);
  let index = 0;
  while (index < keys.length) {
    mapped[keys[index]] = row[keys[index]];
    index = index + 1;
  }
  let mapIndex = 0;
  while (mapIndex < column_map.length) {
    const entry = column_map[mapIndex];
    if (entry.source_column !== "" && entry.target_field !== "") {
      mapped[entry.target_field] = row[entry.source_column] === undefined ? "" : row[entry.source_column];
    }
    mapIndex = mapIndex + 1;
  }
  return Object.freeze(mapped);
}

export function defaultColumnMap(data_type: AssetManagerDataType): readonly AssetManagerColumnMap[] {
  if (data_type === "vehicles") {
    return Object.freeze([
      Object.freeze({ source_column: "vin", target_field: "vin" }),
      Object.freeze({ source_column: "unit_number", target_field: "unit_number" }),
      Object.freeze({ source_column: "make", target_field: "make" }),
      Object.freeze({ source_column: "model", target_field: "model" }),
      Object.freeze({ source_column: "year", target_field: "year" }),
      Object.freeze({ source_column: "mileage", target_field: "mileage" }),
      Object.freeze({ source_column: "hours", target_field: "hours" }),
      Object.freeze({ source_column: "status", target_field: "status" }),
      Object.freeze({ source_column: "telematics_id", target_field: "telematics_id" }),
      Object.freeze({ source_column: "vendor_id", target_field: "vendor_id" }),
    ]);
  }
  if (data_type === "parts") {
    return Object.freeze([
      Object.freeze({ source_column: "name", target_field: "name" }),
      Object.freeze({ source_column: "description", target_field: "description" }),
      Object.freeze({ source_column: "quantity", target_field: "quantity" }),
      Object.freeze({ source_column: "location", target_field: "location" }),
      Object.freeze({ source_column: "reorder_point", target_field: "reorder_point" }),
      Object.freeze({ source_column: "vendor_id", target_field: "vendor_id" }),
    ]);
  }
  if (data_type === "employees") {
    return Object.freeze([
      Object.freeze({ source_column: "name", target_field: "name" }),
      Object.freeze({ source_column: "email", target_field: "email" }),
      Object.freeze({ source_column: "role", target_field: "role" }),
      Object.freeze({ source_column: "status", target_field: "status" }),
    ]);
  }
  if (data_type === "pms") {
    return Object.freeze([
      Object.freeze({ source_column: "asset_id", target_field: "asset_id" }),
      Object.freeze({ source_column: "name", target_field: "name" }),
      Object.freeze({ source_column: "interval_miles", target_field: "interval_miles" }),
      Object.freeze({ source_column: "interval_hours", target_field: "interval_hours" }),
      Object.freeze({ source_column: "due_miles", target_field: "due_miles" }),
      Object.freeze({ source_column: "due_hours", target_field: "due_hours" }),
      Object.freeze({ source_column: "asset_group", target_field: "asset_group" }),
    ]);
  }
  if (data_type === "vendors") {
    return Object.freeze([
      Object.freeze({ source_column: "vendor_name", target_field: "vendor_name" }),
      Object.freeze({ source_column: "location", target_field: "location" }),
    ]);
  }
  return Object.freeze([
    Object.freeze({ source_column: "name", target_field: "name" }),
    Object.freeze({ source_column: "pm_template_name", target_field: "pm_template_name" }),
    Object.freeze({ source_column: "interval_miles", target_field: "interval_miles" }),
    Object.freeze({ source_column: "interval_hours", target_field: "interval_hours" }),
    Object.freeze({ source_column: "severity_default", target_field: "severity_default" }),
    Object.freeze({ source_column: "workorder_source", target_field: "workorder_source" }),
    Object.freeze({ source_column: "telematics_fault_code", target_field: "telematics_fault_code" }),
    Object.freeze({ source_column: "telematics_severity", target_field: "telematics_severity" }),
  ]);
}
