import type { IncomingMessage, ServerResponse } from "http";
import type { ContextDto } from "@/dto/context.dto";
import type { PartsManagerFilter } from "./parts-manager-dashboard.interface";
import type { PartsManagerDashboardService } from "./parts-manager-dashboard.service";

function send(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function filterFromQuery(query: Readonly<Record<string, string>>): PartsManagerFilter {
  return Object.freeze({
    vendor: query.vendor || "",
    part_category: query.part_category || "",
    stock_status: query.stock_status || "",
    severity: query.severity || "",
  });
}

export function createPartsManagerDashboardController(service: PartsManagerDashboardService) {
  return {
    async handle(
      _req: IncomingMessage,
      res: ServerResponse,
      dto: ContextDto,
      operation: string,
      query: Readonly<Record<string, string>>,
    ): Promise<void> {
      const filter = filterFromQuery(query);
      if (operation === "inventory_overview") {
        const result = await service.inventoryOverview(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "awaiting_parts") {
        const result = await service.awaitingParts(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "list_vendors") {
        const result = await service.vendors(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "usage_history") {
        const result = await service.usageHistory(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "predictive_usage") {
        const result = await service.predictiveUsage(dto);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "inventory_alerts") {
        const result = await service.alerts(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      send(res, 404, { ok: false });
    },
  };
}
