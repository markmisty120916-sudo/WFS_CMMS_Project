import { fleetManagerRequest } from "./fleet-manager-dashboard.api.client";
import type { FleetManagerSession } from "../fleet-manager-dashboard.interface";

export async function listFleetWorkorders(session: FleetManagerSession | null, query: Readonly<Record<string, string>>): Promise<unknown> {
  return fleetManagerRequest(session, "/workorders", query);
}
