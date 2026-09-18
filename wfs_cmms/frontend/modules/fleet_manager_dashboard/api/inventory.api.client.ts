import { fleetManagerRequest } from "./fleet-manager-dashboard.api.client";
import type { FleetManagerSession } from "../fleet-manager-dashboard.interface";

export async function listFleetInventory(session: FleetManagerSession | null, query: Readonly<Record<string, string>>): Promise<unknown> {
  return fleetManagerRequest(session, "/parts", query);
}
