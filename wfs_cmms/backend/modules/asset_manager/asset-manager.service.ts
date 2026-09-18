import { createPreparedStatement } from "../../../../src/core/database/prepared-statement";
import type { Database } from "../../../../src/core/database/database.interface";
import type { ContextDto } from "../../../../src/core/dto/context.dto";
import { createError } from "../../../../src/core/errors/error-factory";
import type { ErrorType } from "../../../../src/core/errors/error-types";
import type { EventBusService } from "../../../../src/core/event-bus/event-bus.service";
import type { AuditLogHook, Logger } from "../../../../src/core/logger/logger.interface";
import { err } from "../../../../src/core/results/err";
import { ok } from "../../../../src/core/results/ok";
import type { Result } from "../../../../src/core/results/result.interface";
import type { ResultContext } from "../../../../src/core/results/result-context";
import { isAssetManagerApiAllowed } from "./api/asset-manager.api.permissions";
import type { AssetManagerApiOperation } from "./api/asset-manager.api.contract";
import { incomingEventFromAssetManager, incomingEventFromImport, assetManagerAuditLogId } from "./asset-manager-events";
import { assetManagerWriteError, isVinFormat, mapAuthorizedEmployeeRole } from "./asset-manager-rules";
import type {
  AssetManagerColumnMap,
  AssetManagerConfigPack,
  AssetManagerImport,
  AssetManagerListQuery,
  AssetManagerUploadInput,
  AssetManagerVendorRecord,
} from "./asset-manager.interface";
import { commitImportRows } from "./engines/bulk-commit.engine";
import { previewImport } from "./engines/bulk-preview.engine";
import { applyColumnMap, defaultColumnMap, parseUploadRows } from "./engines/bulk-upload.engine";
import { validateImportRows } from "./engines/bulk-validation.engine";

export type AssetManagerServiceOptions = {
  tenant_id: string;
  logger: Logger;
  database: Database;
  eventBus: EventBusService;
  auditLogHook: AuditLogHook;
};

function resultContextFromDto(dto: ContextDto): ResultContext {
  return {
    tenant_id: dto.tenant_id,
    user_id: dto.user_id,
    role: dto.role,
    timestamp: dto.timestamp,
    correlation_id: dto.correlation_id,
    rule_id: dto.rule_id,
    lifecycle_kind: dto.lifecycle_kind,
    from_state: dto.from_state,
    to_state: dto.to_state,
    entity_id: dto.entity_id,
  };
}

export class AssetManagerService {
  private readonly tenant_id: string;
  private readonly logger: Logger;
  private readonly database: Database;
  private readonly eventBus: EventBusService;
  private readonly auditLogHook: AuditLogHook;
  private readonly imports: Map<string, AssetManagerImport>;
  private readonly packs: Map<string, AssetManagerConfigPack>;
  private readonly vendors: Map<string, AssetManagerVendorRecord>;

  constructor(options: AssetManagerServiceOptions) {
    this.tenant_id = options.tenant_id;
    this.logger = options.logger;
    this.database = options.database;
    this.eventBus = options.eventBus;
    this.auditLogHook = options.auditLogHook;
    this.imports = new Map();
    this.packs = new Map();
    this.vendors = new Map();
  }

  private fail(error_type: ErrorType, dto: ContextDto): Result<never> {
    const context = resultContextFromDto(dto);
    const error = createError(error_type, {
      tenant_id: this.tenant_id,
      user_id: context.user_id,
      role: context.role,
      timestamp: context.timestamp,
      correlation_id: context.correlation_id,
    });
    return err(error, context);
  }

  private guard(dto: ContextDto, operation: AssetManagerApiOperation): Result<never> | null {
    if (dto.tenant_id !== this.tenant_id) {
      return this.fail("tenant_id mismatch", dto);
    }
    const write = assetManagerWriteError(dto.role);
    if (write !== "none") {
      return this.fail(write, dto);
    }
    if (isAssetManagerApiAllowed(operation, dto.role) === false) {
      return this.fail("role unauthorized", dto);
    }
    return null;
  }

  private importKey(import_id: string): string {
    return this.tenant_id + ":" + import_id;
  }

  async upload(dto: ContextDto, input: AssetManagerUploadInput): Promise<Result<AssetManagerImport>> {
    const blocked = this.guard(dto, "bulk_upload");
    if (blocked !== null) {
      return blocked;
    }
    const import_id = dto.correlation_id === "" ? dto.timestamp : dto.correlation_id;
    const rows = parseUploadRows(input.file_format, input.content);
    const mapped = validateImportRows(dto.tenant_id, input.data_type, rows);
    const record: AssetManagerImport = Object.freeze({
      tenant_id: dto.tenant_id,
      import_id,
      data_type: input.data_type,
      file_format: input.file_format,
      status: "uploaded",
      created_by: dto.user_id,
      created_at: dto.timestamp,
      updated_at: dto.timestamp,
      rows: mapped,
    });
    this.imports.set(this.importKey(import_id), record);
    this.logger.info("uploaded");
    return ok(record, resultContextFromDto(dto));
  }

  async validate(dto: ContextDto, import_id: string, column_map: readonly AssetManagerColumnMap[]): Promise<Result<AssetManagerImport>> {
    const blocked = this.guard(dto, "bulk_validate");
    if (blocked !== null) {
      return blocked;
    }
    const current = this.imports.get(this.importKey(import_id));
    if (current === undefined) {
      return this.fail("entity_id required", dto);
    }
    if (current.tenant_id !== dto.tenant_id) {
      return this.fail("tenant_id mismatch", dto);
    }
    const map = column_map.length === 0 ? defaultColumnMap(current.data_type) : column_map;
    const remapped: Readonly<Record<string, string>>[] = [];
    let index = 0;
    while (index < current.rows.length) {
      remapped.push(applyColumnMap(current.rows[index].payload, map));
      index = index + 1;
    }
    const rows = validateImportRows(dto.tenant_id, current.data_type, remapped);
    const next: AssetManagerImport = Object.freeze({
      ...current,
      status: "validated",
      updated_at: dto.timestamp,
      rows,
    });
    this.imports.set(this.importKey(import_id), next);
    return ok(next, resultContextFromDto(dto));
  }

  async preview(dto: ContextDto, import_id: string): Promise<Result<AssetManagerImport>> {
    const blocked = this.guard(dto, "bulk_preview");
    if (blocked !== null) {
      return blocked;
    }
    const current = this.imports.get(this.importKey(import_id));
    if (current === undefined) {
      return this.fail("entity_id required", dto);
    }
    previewImport(current);
    const next: AssetManagerImport = Object.freeze({
      ...current,
      status: "previewed",
      updated_at: dto.timestamp,
    });
    this.imports.set(this.importKey(import_id), next);
    return ok(next, resultContextFromDto(dto));
  }

  async commit(dto: ContextDto, import_id: string): Promise<Result<AssetManagerImport>> {
    const blocked = this.guard(dto, "bulk_commit");
    if (blocked !== null) {
      return blocked;
    }
    const current = this.imports.get(this.importKey(import_id));
    if (current === undefined) {
      return this.fail("entity_id required", dto);
    }
    const result = await commitImportRows(this.database, dto, current);
    const failed = result.committed === false;
    const next: AssetManagerImport = Object.freeze({
      ...current,
      status: failed === true ? "failed" : "completed",
      updated_at: dto.timestamp,
    });
    this.imports.set(this.importKey(import_id), next);
    const incoming = incomingEventFromImport(dto, next, failed);
    if (failed === true) {
      await this.audit(dto, "bulk_import.failed", import_id, result.reason);
      await this.eventBus.publish(incoming);
      return this.fail("dto invalid", dto);
    }
    await this.audit(dto, "bulk_import.completed", import_id, result.reason);
    await this.eventBus.publish(incoming);
    return ok(next, resultContextFromDto(dto));
  }

  async listImports(dto: ContextDto, query: AssetManagerListQuery): Promise<Result<readonly AssetManagerImport[]>> {
    const blocked = this.guard(dto, "list_imports");
    if (blocked !== null) {
      return blocked;
    }
    const items: AssetManagerImport[] = [];
    this.imports.forEach((record) => {
      if (record.tenant_id === dto.tenant_id) {
        let include = true;
        if (query.status !== "" && record.status !== query.status) {
          include = false;
        }
        if (query.data_type !== "" && record.data_type !== query.data_type) {
          include = false;
        }
        if (include === true) {
          items.push(record);
        }
      }
    });
    return ok(items, resultContextFromDto(dto));
  }

  async getImport(dto: ContextDto, import_id: string): Promise<Result<AssetManagerImport>> {
    const blocked = this.guard(dto, "get_import");
    if (blocked !== null) {
      return blocked;
    }
    const current = this.imports.get(this.importKey(import_id));
    if (current === undefined) {
      return this.fail("entity_id required", dto);
    }
    if (current.tenant_id !== dto.tenant_id) {
      return this.fail("tenant_id mismatch", dto);
    }
    return ok(current, resultContextFromDto(dto));
  }

  async listAssets(dto: ContextDto): Promise<Result<readonly Readonly<Record<string, unknown>>[]>> {
    const blocked = this.guard(dto, "list_assets");
    if (blocked !== null) {
      return blocked;
    }
    const result = await this.database.execute(
      createPreparedStatement(
        "SELECT asset_id, tenant_id, vin, unit_number, make, model, year, mileage, hours, status, created_at, updated_at, deleted_at FROM Assets WHERE tenant_id = $1 AND deleted_at IS NULL",
        [dto.tenant_id],
      ),
    );
    return ok(result.rows, resultContextFromDto(dto));
  }

  async createAsset(dto: ContextDto, body: Readonly<Record<string, string>>): Promise<Result<null>> {
    const blocked = this.guard(dto, "create_asset");
    if (blocked !== null) {
      return blocked;
    }
    const asset_id = body.asset_id || body.vin || dto.entity_id;
    if (isVinFormat((body.vin || "").toUpperCase()) === false) {
      return this.fail("dto invalid", dto);
    }
    await this.database.execute(
      createPreparedStatement(
        "INSERT INTO Assets (asset_id, tenant_id, vin, unit_number, make, model, year, mileage, hours, status, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11, NULL)",
        [dto.tenant_id, asset_id, (body.vin || "").toUpperCase(), body.unit_number || "", body.make || "", body.model || "", body.year || "", body.mileage || "", body.hours || "", body.status || "", dto.timestamp],
      ),
    );
    await this.eventBus.publish(incomingEventFromAssetManager(dto, "asset.created", asset_id, { asset_id }));
    await this.audit(dto, "asset.created", asset_id, "created");
    return ok(null, resultContextFromDto(dto));
  }

  async updateAsset(dto: ContextDto, asset_id: string, body: Readonly<Record<string, string>>): Promise<Result<null>> {
    const blocked = this.guard(dto, "update_asset");
    if (blocked !== null) {
      return blocked;
    }
    await this.database.execute(
      createPreparedStatement(
        "UPDATE Assets SET vin = $3, unit_number = $4, make = $5, model = $6, year = $7, mileage = $8, hours = $9, status = $10, updated_at = $11 WHERE tenant_id = $1 AND asset_id = $2 AND deleted_at IS NULL",
        [dto.tenant_id, asset_id, (body.vin || "").toUpperCase(), body.unit_number || "", body.make || "", body.model || "", body.year || "", body.mileage || "", body.hours || "", body.status || "", dto.timestamp],
      ),
    );
    await this.eventBus.publish(incomingEventFromAssetManager(dto, "asset.updated", asset_id, { asset_id }));
    await this.audit(dto, "asset.updated", asset_id, "updated");
    return ok(null, resultContextFromDto(dto));
  }

  async deleteAsset(dto: ContextDto, asset_id: string): Promise<Result<null>> {
    const blocked = this.guard(dto, "delete_asset");
    if (blocked !== null) {
      return blocked;
    }
    await this.database.execute(
      createPreparedStatement(
        "UPDATE Assets SET deleted_at = $3, updated_at = $3 WHERE tenant_id = $1 AND asset_id = $2 AND deleted_at IS NULL",
        [dto.tenant_id, asset_id, dto.timestamp],
      ),
    );
    await this.eventBus.publish(incomingEventFromAssetManager(dto, "asset.deleted", asset_id, { asset_id }));
    await this.audit(dto, "asset.deleted", asset_id, "deleted");
    return ok(null, resultContextFromDto(dto));
  }

  async listParts(dto: ContextDto): Promise<Result<readonly Readonly<Record<string, unknown>>[]>> {
    const blocked = this.guard(dto, "list_parts");
    if (blocked !== null) {
      return blocked;
    }
    const result = await this.database.execute(
      createPreparedStatement(
        "SELECT part_id, tenant_id, name, description, quantity, location, created_at, updated_at, deleted_at FROM Parts WHERE tenant_id = $1 AND deleted_at IS NULL",
        [dto.tenant_id],
      ),
    );
    return ok(result.rows, resultContextFromDto(dto));
  }

  async createPart(dto: ContextDto, body: Readonly<Record<string, string>>): Promise<Result<null>> {
    const blocked = this.guard(dto, "create_part");
    if (blocked !== null) {
      return blocked;
    }
    const part_id = body.part_id || dto.entity_id;
    await this.database.execute(
      createPreparedStatement(
        "INSERT INTO Parts (part_id, tenant_id, name, description, quantity, location, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $7, $7, NULL)",
        [dto.tenant_id, part_id, body.name || "", body.description || "", body.quantity || "", body.location || "", dto.timestamp],
      ),
    );
    return ok(null, resultContextFromDto(dto));
  }

  async updatePart(dto: ContextDto, part_id: string, body: Readonly<Record<string, string>>): Promise<Result<null>> {
    const blocked = this.guard(dto, "update_part");
    if (blocked !== null) {
      return blocked;
    }
    await this.database.execute(
      createPreparedStatement(
        "UPDATE Parts SET name = $3, description = $4, quantity = $5, location = $6, updated_at = $7 WHERE tenant_id = $1 AND part_id = $2 AND deleted_at IS NULL",
        [dto.tenant_id, part_id, body.name || "", body.description || "", body.quantity || "", body.location || "", dto.timestamp],
      ),
    );
    return ok(null, resultContextFromDto(dto));
  }

  async deletePart(dto: ContextDto, part_id: string): Promise<Result<null>> {
    const blocked = this.guard(dto, "delete_part");
    if (blocked !== null) {
      return blocked;
    }
    await this.database.execute(
      createPreparedStatement(
        "UPDATE Parts SET deleted_at = $3, updated_at = $3 WHERE tenant_id = $1 AND part_id = $2 AND deleted_at IS NULL",
        [dto.tenant_id, part_id, dto.timestamp],
      ),
    );
    return ok(null, resultContextFromDto(dto));
  }

  async listEmployees(dto: ContextDto): Promise<Result<readonly Readonly<Record<string, unknown>>[]>> {
    const blocked = this.guard(dto, "list_employees");
    if (blocked !== null) {
      return blocked;
    }
    const result = await this.database.execute(
      createPreparedStatement(
        "SELECT user_id, tenant_id, name, email, role, status, created_at, updated_at, deleted_at FROM Users WHERE tenant_id = $1 AND deleted_at IS NULL",
        [dto.tenant_id],
      ),
    );
    return ok(result.rows, resultContextFromDto(dto));
  }

  async createEmployee(dto: ContextDto, body: Readonly<Record<string, string>>): Promise<Result<null>> {
    const blocked = this.guard(dto, "create_employee");
    if (blocked !== null) {
      return blocked;
    }
    const user_id = body.user_id || dto.entity_id;
    const role = mapAuthorizedEmployeeRole(body.role || "");
    if (role === null) {
      return this.fail("dto invalid", dto);
    }
    await this.database.execute(
      createPreparedStatement(
        "INSERT INTO Users (user_id, tenant_id, name, email, role, status, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $7, $7, NULL)",
        [dto.tenant_id, user_id, body.name || "", body.email || "", role, body.status || "", dto.timestamp],
      ),
    );
    return ok(null, resultContextFromDto(dto));
  }

  async updateEmployee(dto: ContextDto, user_id: string, body: Readonly<Record<string, string>>): Promise<Result<null>> {
    const blocked = this.guard(dto, "update_employee");
    if (blocked !== null) {
      return blocked;
    }
    const role = mapAuthorizedEmployeeRole(body.role || "");
    if (role === null) {
      return this.fail("dto invalid", dto);
    }
    await this.database.execute(
      createPreparedStatement(
        "UPDATE Users SET name = $3, email = $4, role = $5, status = $6, updated_at = $7 WHERE tenant_id = $1 AND user_id = $2 AND deleted_at IS NULL",
        [dto.tenant_id, user_id, body.name || "", body.email || "", role, body.status || "", dto.timestamp],
      ),
    );
    return ok(null, resultContextFromDto(dto));
  }

  async deleteEmployee(dto: ContextDto, user_id: string): Promise<Result<null>> {
    const blocked = this.guard(dto, "delete_employee");
    if (blocked !== null) {
      return blocked;
    }
    await this.database.execute(
      createPreparedStatement(
        "UPDATE Users SET deleted_at = $3, updated_at = $3 WHERE tenant_id = $1 AND user_id = $2 AND deleted_at IS NULL",
        [dto.tenant_id, user_id, dto.timestamp],
      ),
    );
    return ok(null, resultContextFromDto(dto));
  }

  async listPm(dto: ContextDto): Promise<Result<readonly Readonly<Record<string, unknown>>[]>> {
    const blocked = this.guard(dto, "list_pm");
    if (blocked !== null) {
      return blocked;
    }
    const result = await this.database.execute(
      createPreparedStatement(
        "SELECT pm_schedule_id, tenant_id, asset_id, pm_template_id, due_miles, due_hours, status, created_at, updated_at, deleted_at FROM PMSchedule WHERE tenant_id = $1 AND deleted_at IS NULL",
        [dto.tenant_id],
      ),
    );
    return ok(result.rows, resultContextFromDto(dto));
  }

  async createPm(dto: ContextDto, body: Readonly<Record<string, string>>): Promise<Result<null>> {
    const blocked = this.guard(dto, "create_pm");
    if (blocked !== null) {
      return blocked;
    }
    const template_id = body.pm_template_id || body.name || dto.entity_id;
    await this.database.execute(
      createPreparedStatement(
        "INSERT INTO PMTemplates (pm_template_id, tenant_id, name, interval_miles, interval_hours, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $6, NULL)",
        [dto.tenant_id, template_id, body.name || "", body.interval_miles || "", body.interval_hours || "", dto.timestamp],
      ),
    );
    const schedule_id = body.pm_schedule_id || template_id;
    await this.database.execute(
      createPreparedStatement(
        "INSERT INTO PMSchedule (pm_schedule_id, tenant_id, asset_id, pm_template_id, due_miles, due_hours, status, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $7, $8, $8, NULL)",
        [dto.tenant_id, schedule_id, body.asset_id || "", template_id, body.due_miles || "", body.due_hours || "", body.status || "", dto.timestamp],
      ),
    );
    return ok(null, resultContextFromDto(dto));
  }

  async updatePm(dto: ContextDto, pm_schedule_id: string, body: Readonly<Record<string, string>>): Promise<Result<null>> {
    const blocked = this.guard(dto, "update_pm");
    if (blocked !== null) {
      return blocked;
    }
    await this.database.execute(
      createPreparedStatement(
        "UPDATE PMSchedule SET asset_id = $3, pm_template_id = $4, due_miles = $5, due_hours = $6, status = $7, updated_at = $8 WHERE tenant_id = $1 AND pm_schedule_id = $2 AND deleted_at IS NULL",
        [dto.tenant_id, pm_schedule_id, body.asset_id || "", body.pm_template_id || "", body.due_miles || "", body.due_hours || "", body.status || "", dto.timestamp],
      ),
    );
    return ok(null, resultContextFromDto(dto));
  }

  async deletePm(dto: ContextDto, pm_schedule_id: string): Promise<Result<null>> {
    const blocked = this.guard(dto, "delete_pm");
    if (blocked !== null) {
      return blocked;
    }
    await this.database.execute(
      createPreparedStatement(
        "UPDATE PMSchedule SET deleted_at = $3, updated_at = $3 WHERE tenant_id = $1 AND pm_schedule_id = $2 AND deleted_at IS NULL",
        [dto.tenant_id, pm_schedule_id, dto.timestamp],
      ),
    );
    return ok(null, resultContextFromDto(dto));
  }

  async listVendors(dto: ContextDto): Promise<Result<readonly AssetManagerVendorRecord[]>> {
    const blocked = this.guard(dto, "list_vendors");
    if (blocked !== null) {
      return blocked;
    }
    const items: AssetManagerVendorRecord[] = [];
    this.vendors.forEach((vendor) => {
      if (vendor.tenant_id === dto.tenant_id) {
        items.push(vendor);
      }
    });
    return ok(items, resultContextFromDto(dto));
  }

  async upsertVendor(dto: ContextDto, body: Readonly<Record<string, string>>): Promise<Result<AssetManagerVendorRecord>> {
    const blocked = this.guard(dto, "upsert_vendor");
    if (blocked !== null) {
      return blocked;
    }
    const vendor_name = body.vendor_name || "";
    if (vendor_name === "") {
      return this.fail("dto invalid", dto);
    }
    const vendor: AssetManagerVendorRecord = Object.freeze({
      tenant_id: dto.tenant_id,
      vendor_name,
      location: body.location || "",
    });
    this.vendors.set(this.tenant_id + ":" + vendor_name, vendor);
    return ok(vendor, resultContextFromDto(dto));
  }

  async applyPack(dto: ContextDto, pack_id: string): Promise<Result<AssetManagerConfigPack | null>> {
    const blocked = this.guard(dto, "apply_pack");
    if (blocked !== null) {
      return blocked;
    }
    const pack = this.packs.get(this.tenant_id + ":" + pack_id);
    if (pack === undefined) {
      return this.fail("entity_id required", dto);
    }
    await this.database.execute(
      createPreparedStatement(
        "INSERT INTO PMTemplates (pm_template_id, tenant_id, name, interval_miles, interval_hours, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $6, $6, NULL)",
        [dto.tenant_id, pack.pack_id, pack.pm_template_name, pack.interval_miles, pack.interval_hours, dto.timestamp],
      ),
    );
    await this.eventBus.publish(incomingEventFromAssetManager(dto, "configuration_pack.applied", pack_id, { pack_id }));
    await this.audit(dto, "configuration_pack.applied", pack_id, "applied");
    return ok(pack, resultContextFromDto(dto));
  }

  async createPack(dto: ContextDto, body: Readonly<Record<string, string>>): Promise<Result<AssetManagerConfigPack>> {
    const blocked = this.guard(dto, "create_pack");
    if (blocked !== null) {
      return blocked;
    }
    const pack_id = body.pack_id || dto.entity_id || dto.correlation_id;
    const pack: AssetManagerConfigPack = Object.freeze({
      tenant_id: dto.tenant_id,
      pack_id,
      name: body.name || "",
      pm_template_name: body.pm_template_name || "",
      interval_miles: body.interval_miles || "",
      interval_hours: body.interval_hours || "",
      severity_default: body.severity_default || "",
      workorder_source: body.workorder_source || "",
      telematics_fault_code: body.telematics_fault_code || "",
      telematics_severity: body.telematics_severity || "",
      created_at: dto.timestamp,
      updated_at: dto.timestamp,
      deleted_at: null,
    });
    this.packs.set(this.tenant_id + ":" + pack_id, pack);
    return ok(pack, resultContextFromDto(dto));
  }

  async listPacks(dto: ContextDto): Promise<Result<readonly AssetManagerConfigPack[]>> {
    const blocked = this.guard(dto, "list_packs");
    if (blocked !== null) {
      return blocked;
    }
    const items: AssetManagerConfigPack[] = [];
    this.packs.forEach((pack) => {
      if (pack.tenant_id === dto.tenant_id) {
        items.push(pack);
      }
    });
    return ok(items, resultContextFromDto(dto));
  }

  private async audit(dto: ContextDto, action: "asset.created" | "asset.updated" | "asset.deleted" | "bulk_import.completed" | "bulk_import.failed" | "configuration_pack.applied", entity_id: string, message: string): Promise<void> {
    const log_id = assetManagerAuditLogId(entity_id, action, dto.timestamp);
    await this.database.execute(
      createPreparedStatement(
        "INSERT INTO IntegrationLogs (log_id, tenant_id, event_id, message, created_at, updated_at, deleted_at) VALUES ($2, $1, $3, $4, $5, $5, NULL)",
        [dto.tenant_id, log_id, log_id, message, dto.timestamp],
      ),
    );
    this.logger.info(action);
    this.auditLogHook.write({
      level: "info",
      message: action,
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      role: dto.role,
      correlation_id: entity_id,
      timestamp: dto.timestamp,
    });
  }
}
