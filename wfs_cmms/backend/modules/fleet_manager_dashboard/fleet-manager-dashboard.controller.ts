import type { IncomingMessage, ServerResponse } from "http";
import type { ContextDto } from "@/dto/context.dto";
import type { FleetManagerFilter } from "./fleet-manager-dashboard.interface";
import type { FleetManagerDashboardService } from "./fleet-manager-dashboard.service";

function send(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function filterFromQuery(query: Readonly<Record<string, string>>): FleetManagerFilter {
  return Object.freeze({
    severity: query.severity || "",
    asset_group: query.asset_group || "",
    technician: query.technician || "",
    pm_status: query.pm_status || "",
    vendor: query.vendor || "",
  });
}

export function createFleetManagerDashboardController(service: FleetManagerDashboardService) {
  return {
    async handle(
      _req: IncomingMessage,
      res: ServerResponse,
      dto: ContextDto,
      operation: string,
      query: Readonly<Record<string, string>>,
    ): Promise<void> {
      const filter = filterFromQuery(query);
      if (operation === "fleet_health") {
        const result = await service.health(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "fleet_breakdowns") {
        const result = await service.breakdowns(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "fleet_pm_status") {
        const result = await service.pmStatus(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "fleet_inventory_impact") {
        const result = await service.inventoryImpact(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "fleet_technician_workload") {
        const result = await service.technicianWorkload(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "fleet_find_vehicle") {
        const result = await service.findVehicle(dto, filter);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      if (operation === "fleet_aimi_insights") {
        const result = await service.aimiInsights(dto);
        send(res, result.ok === true ? 200 : 400, result);
        return;
      }
      send(res, 404, { ok: false });
    },
  };
}
