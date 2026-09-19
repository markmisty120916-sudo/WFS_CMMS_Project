import type { DtoRole } from "../../../../src/core/dto/base.dto";
import type { ErrorType } from "../../../../src/core/errors/error-types";

export type AssetManagerBuildResult<T> =
  | { success: true; error_code: "none"; value: T }
  | { success: false; error_code: ErrorType; value: null };

export type AssetManagerDataType =
  | "vehicles"
  | "parts"
  | "employees"
  | "pms"
  | "vendors"
  | "config_packs";

export type AssetManagerImportStatus = "uploaded" | "validated" | "previewed" | "completed" | "failed";

export type AssetManagerRowAction = "create" | "update" | "reject";

export type AssetManagerFileFormat = "csv" | "xlsx" | "json";

export type AssetManagerAssetRecord = {
  readonly tenant_id: string;
  readonly asset_id: string;
  readonly vin: string;
  readonly unit_number: string;
  readonly make: string;
  readonly model: string;
  readonly year: string;
  readonly mileage: string;
  readonly hours: string;
  readonly status: string;
  readonly telematics_id: string;
  readonly vendor_id: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type AssetManagerPartRecord = {
  readonly tenant_id: string;
  readonly part_id: string;
  readonly name: string;
  readonly description: string;
  readonly quantity: string;
  readonly location: string;
  readonly reorder_point: string;
  readonly vendor_id: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type AssetManagerEmployeeRecord = {
  readonly tenant_id: string;
  readonly user_id: string;
  readonly name: string;
  readonly email: string;
  readonly role: DtoRole;
  readonly status: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type AssetManagerPmRecord = {
  readonly tenant_id: string;
  readonly pm_schedule_id: string;
  readonly asset_id: string;
  readonly pm_template_id: string;
  readonly name: string;
  readonly interval_miles: string;
  readonly interval_hours: string;
  readonly due_miles: string;
  readonly due_hours: string;
  readonly status: string;
  readonly asset_group: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type AssetManagerVendorRecord = {
  readonly tenant_id: string;
  readonly vendor_id: string;
  readonly vendor_name: string;
  readonly location: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type AssetManagerConfigPack = {
  readonly tenant_id: string;
  readonly pack_id: string;
  readonly name: string;
  readonly pm_template_name: string;
  readonly interval_miles: string;
  readonly interval_hours: string;
  readonly severity_default: string;
  readonly workorder_source: string;
  readonly telematics_fault_code: string;
  readonly telematics_severity: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

export type AssetManagerImportRow = {
  readonly tenant_id: string;
  readonly row_index: string;
  readonly data_type: AssetManagerDataType;
  readonly action: AssetManagerRowAction;
  readonly reason: string;
  readonly payload: Readonly<Record<string, string>>;
};

export type AssetManagerImport = {
  readonly tenant_id: string;
  readonly import_id: string;
  readonly data_type: AssetManagerDataType;
  readonly file_format: AssetManagerFileFormat;
  readonly status: AssetManagerImportStatus;
  readonly created_by: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly audit_summary: string;
  readonly rows: readonly AssetManagerImportRow[];
};

export type AssetManagerUploadInput = {
  readonly data_type: AssetManagerDataType;
  readonly file_format: AssetManagerFileFormat;
  readonly file_name: string;
  readonly content: string;
};

export type AssetManagerColumnMap = {
  readonly source_column: string;
  readonly target_field: string;
};

export type AssetManagerValidateInput = {
  readonly import_id: string;
  readonly column_map: readonly AssetManagerColumnMap[];
};

export type AssetManagerListQuery = {
  readonly status: string;
  readonly data_type: string;
};
