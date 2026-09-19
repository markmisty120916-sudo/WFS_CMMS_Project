import type { IncomingMessage, ServerResponse } from "http";
import type { ContextDto } from "../../../../src/core/dto/context.dto";
import type { DriverPortalFilter, DriverPortalWriteInput } from "./driver-portal.interface";
import type { DriverPortalService } from "./driver-portal.service";

function send(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function filterFromQuery(query: Readonly<Record<string, string>>): DriverPortalFilter {
  return Object.freeze({
    asset: query.asset || "",
  });
}

function fieldFromBody(body: Readonly<Record<string, unknown>>, key: string): string {
  const value = body[key];
  if (typeof value === "string") {
    return value;
  }
  return "";
}

function writeFromBody(body: Readonly<Record<string, unknown>>): DriverPortalWriteInput {
  return Object.freeze({
    asset_id: fieldFromBody(body, "asset_id"),
    description: fieldFromBody(body, "description"),
    notes: fieldFromBody(body, "notes"),
    photo_url: fieldFromBody(body, "photo_url"),
    voice_note: fieldFromBody(body, "voice_note"),
    category: fieldFromBody(body, "category"),
    workorder_id: fieldFromBody(body, "workorder_id"),
    alert_id: fieldFromBody(body, "alert_id"),
  });
}

function readBody(req: IncomingMessage): Promise<Readonly<Record<string, unknown>>> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (raw === "") {
        resolve({});
        return;
      }
      try {
        const parsed: unknown = JSON.parse(raw);
        if (parsed !== null && typeof parsed === "object" && Array.isArray(parsed) === false) {
          resolve(parsed as Record<string, unknown>);
          return;
        }
        resolve({});
      } catch {
        resolve({});
      }
    });
  });
}

export function createDriverPortalController(service: DriverPortalService) {
  return {
    async handle(
      req: IncomingMessage,
      res: ServerResponse,
      dto: ContextDto,
      operation: string,
      query: Readonly<Record<string, string>>,
    ): Promise<void> {
      const filter = filterFromQuery(query);
      if (operation === "assigned_vehicle") {
        const result = await service.assignedVehicle(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "dvir") {
        const result = await service.dvir(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "dvir_submit") {
        const result = await service.submitDvir(dto, writeFromBody(await readBody(req)));
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "defect") {
        const result = await service.defects(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "defect_submit") {
        const result = await service.submitDefect(dto, writeFromBody(await readBody(req)));
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "inspections") {
        const result = await service.inspections(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "workorders") {
        const result = await service.workorders(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "aimi_safety") {
        const result = await service.aimiSafety(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "pm") {
        const result = await service.pm(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "compliance") {
        const result = await service.compliance(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "telematics") {
        const result = await service.telematics(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "note_added") {
        const result = await service.addNote(dto, writeFromBody(await readBody(req)));
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "photo_added") {
        const result = await service.addPhoto(dto, writeFromBody(await readBody(req)));
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "alert_acknowledged") {
        const result = await service.acknowledgeAlert(dto, writeFromBody(await readBody(req)));
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      send(res, 404, { ok: false });
    },
  };
}
