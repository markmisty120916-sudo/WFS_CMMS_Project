import type { IncomingMessage, ServerResponse } from "http";
import type { ContextDto } from "../../../../src/core/dto/context.dto";
import type { AssetManagerService } from "./asset-manager.service";
import type { AssetManagerColumnMap, AssetManagerDataType, AssetManagerFileFormat, AssetManagerUploadInput } from "./asset-manager.interface";

function send(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    const chunks: string[] = [];
    req.on("data", (chunk: Buffer | string) => {
      chunks.push(typeof chunk === "string" ? chunk : chunk.toString("utf8"));
    });
    req.on("end", () => {
      resolve(chunks.join(""));
    });
  });
}

export function createAssetManagerController(service: AssetManagerService) {
  return {
    async handle(req: IncomingMessage, res: ServerResponse, dto: ContextDto, operation: string, params: Readonly<Record<string, string>>): Promise<void> {
      const raw = await readBody(req);
      let parsed: Record<string, unknown> = {};
      if (raw !== "") {
        try {
          parsed = JSON.parse(raw) as Record<string, unknown>;
        } catch {
          send(res, 400, { ok: false });
          return;
        }
      }
      const asString = (key: string): string => {
        const value = parsed[key];
        return typeof value === "string" ? value : "";
      };
      if (operation === "bulk_upload") {
        const input: AssetManagerUploadInput = {
          data_type: asString("data_type") as AssetManagerDataType,
          file_format: asString("file_format") as AssetManagerFileFormat,
          file_name: asString("file_name"),
          content: asString("content"),
        };
        const result = await service.upload(dto, input);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "bulk_validate") {
        const mapRaw = parsed.column_map;
        const column_map: AssetManagerColumnMap[] = [];
        if (Array.isArray(mapRaw) === true) {
          let index = 0;
          while (index < mapRaw.length) {
            const item = mapRaw[index] as Record<string, unknown>;
            column_map.push({
              source_column: typeof item.source_column === "string" ? item.source_column : "",
              target_field: typeof item.target_field === "string" ? item.target_field : "",
            });
            index = index + 1;
          }
        }
        const result = await service.validate(dto, params.import_id || "", column_map);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "bulk_preview") {
        const result = await service.preview(dto, params.import_id || "");
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "bulk_commit") {
        const result = await service.commit(dto, params.import_id || "");
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "list_imports") {
        const result = await service.listImports(dto, { status: asString("status"), data_type: asString("data_type") });
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "get_import") {
        const result = await service.getImport(dto, params.import_id || "");
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "list_assets") {
        const result = await service.listAssets(dto);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "create_asset") {
        const body: Record<string, string> = {};
        const keys = Object.keys(parsed);
        let index = 0;
        while (index < keys.length) {
          const key = keys[index];
          const value = parsed[key];
          body[key] = typeof value === "string" ? value : "";
          index = index + 1;
        }
        const result = await service.createAsset(dto, body);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "update_asset") {
        const body: Record<string, string> = {};
        const keys = Object.keys(parsed);
        let index = 0;
        while (index < keys.length) {
          const key = keys[index];
          const value = parsed[key];
          body[key] = typeof value === "string" ? value : "";
          index = index + 1;
        }
        const result = await service.updateAsset(dto, params.asset_id || "", body);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "delete_asset") {
        const result = await service.deleteAsset(dto, params.asset_id || "");
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "list_parts") {
        const result = await service.listParts(dto);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "create_part") {
        const body: Record<string, string> = {};
        const keys = Object.keys(parsed);
        let i = 0;
        while (i < keys.length) {
          const key = keys[i];
          const value = parsed[key];
          body[key] = typeof value === "string" ? value : "";
          i = i + 1;
        }
        const result = await service.createPart(dto, body);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "update_part") {
        const body: Record<string, string> = {};
        const keys = Object.keys(parsed);
        let i = 0;
        while (i < keys.length) {
          const key = keys[i];
          const value = parsed[key];
          body[key] = typeof value === "string" ? value : "";
          i = i + 1;
        }
        const result = await service.updatePart(dto, params.part_id || "", body);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "delete_part") {
        const result = await service.deletePart(dto, params.part_id || "");
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "list_employees") {
        const result = await service.listEmployees(dto);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "create_employee") {
        const body: Record<string, string> = {};
        const keys = Object.keys(parsed);
        let i = 0;
        while (i < keys.length) {
          const key = keys[i];
          const value = parsed[key];
          body[key] = typeof value === "string" ? value : "";
          i = i + 1;
        }
        const result = await service.createEmployee(dto, body);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "update_employee") {
        const body: Record<string, string> = {};
        const keys = Object.keys(parsed);
        let i = 0;
        while (i < keys.length) {
          const key = keys[i];
          const value = parsed[key];
          body[key] = typeof value === "string" ? value : "";
          i = i + 1;
        }
        const result = await service.updateEmployee(dto, params.user_id || "", body);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "delete_employee") {
        const result = await service.deleteEmployee(dto, params.user_id || "");
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "list_pm") {
        const result = await service.listPm(dto);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "create_pm") {
        const body: Record<string, string> = {};
        const keys = Object.keys(parsed);
        let i = 0;
        while (i < keys.length) {
          const key = keys[i];
          const value = parsed[key];
          body[key] = typeof value === "string" ? value : "";
          i = i + 1;
        }
        const result = await service.createPm(dto, body);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "update_pm") {
        const body: Record<string, string> = {};
        const keys = Object.keys(parsed);
        let i = 0;
        while (i < keys.length) {
          const key = keys[i];
          const value = parsed[key];
          body[key] = typeof value === "string" ? value : "";
          i = i + 1;
        }
        const result = await service.updatePm(dto, params.pm_schedule_id || "", body);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "delete_pm") {
        const result = await service.deletePm(dto, params.pm_schedule_id || "");
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "list_vendors") {
        const result = await service.listVendors(dto);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "upsert_vendor") {
        const body: Record<string, string> = {};
        const keys = Object.keys(parsed);
        let i = 0;
        while (i < keys.length) {
          const key = keys[i];
          const value = parsed[key];
          body[key] = typeof value === "string" ? value : "";
          i = i + 1;
        }
        const result = await service.upsertVendor(dto, body);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "list_packs") {
        const result = await service.listPacks(dto);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "create_pack") {
        const body: Record<string, string> = {};
        const keys = Object.keys(parsed);
        let i = 0;
        while (i < keys.length) {
          const key = keys[i];
          const value = parsed[key];
          body[key] = typeof value === "string" ? value : "";
          i = i + 1;
        }
        const result = await service.createPack(dto, body);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "apply_pack") {
        const result = await service.applyPack(dto, params.pack_id || "");
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      send(res, 404, { ok: false });
    },
  };
}
