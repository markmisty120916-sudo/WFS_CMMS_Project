import type { IncomingMessage, ServerResponse } from "http";
import type { ContextDto } from "../../../../src/core/dto/context.dto";
import type { SilentMasterKeyFilter, SilentMasterKeyOverrideInput } from "./silent-master-key-dashboard.interface";
import type { SilentMasterKeyDashboardService } from "./silent-master-key-dashboard.service";

function send(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function filterFromQuery(query: Readonly<Record<string, string>>): SilentMasterKeyFilter {
  return Object.freeze({
    asset: query.asset || "",
    workorder_id: query.workorder_id || "",
  });
}

function fieldFromBody(body: Readonly<Record<string, unknown>>, key: string): string {
  const value = body[key];
  if (typeof value === "string") {
    return value;
  }
  return "";
}

function overrideFromBody(body: Readonly<Record<string, unknown>>): SilentMasterKeyOverrideInput {
  return Object.freeze({
    workorder_id: fieldFromBody(body, "workorder_id"),
    asset_id: fieldFromBody(body, "asset_id"),
    severity: fieldFromBody(body, "severity"),
    technician_id: fieldFromBody(body, "technician_id"),
    bay_id: fieldFromBody(body, "bay_id"),
    scheduled_start: fieldFromBody(body, "scheduled_start"),
    scheduled_end: fieldFromBody(body, "scheduled_end"),
    reason: fieldFromBody(body, "reason"),
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

export function createSilentMasterKeyDashboardController(service: SilentMasterKeyDashboardService) {
  return {
    async handle(
      req: IncomingMessage,
      res: ServerResponse,
      dto: ContextDto,
      operation: string,
      query: Readonly<Record<string, string>>,
    ): Promise<void> {
      const filter = filterFromQuery(query);
      if (operation === "dashboards") {
        const result = await service.dashboards(dto);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "aimi") {
        const result = await service.aimi(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "predictive") {
        const result = await service.predictive(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "diagnostics") {
        const result = await service.diagnostics(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "workorders") {
        const result = await service.workorders(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "severity_override") {
        const result = await service.overrideSeverity(dto, overrideFromBody(await readBody(req)));
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "routing_override") {
        const result = await service.overrideRouting(dto, overrideFromBody(await readBody(req)));
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "scheduling_override") {
        const result = await service.overrideScheduling(dto, overrideFromBody(await readBody(req)));
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      send(res, 404, { ok: false });
    },
  };
}
