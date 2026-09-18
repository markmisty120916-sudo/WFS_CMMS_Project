import { fleetManagerRequest } from "./fleet-manager-dashboard.api.client";
import type { FleetManagerSession } from "../fleet-manager-dashboard.interface";

export async function listFleetAssets(session: FleetManagerSession | null, query: Readonly<Record<string, string>>): Promise<unknown> {
  return fleetManagerRequest(session, "/assets", query);
}
