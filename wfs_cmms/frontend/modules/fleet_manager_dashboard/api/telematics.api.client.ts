import { fleetManagerRequest } from "./fleet-manager-dashboard.api.client";
import type { FleetManagerSession } from "../fleet-manager-dashboard.interface";

export async function listFleetTelematics(session: FleetManagerSession | null, asset_id: string): Promise<unknown> {
  if (asset_id === "") {
    return fleetManagerRequest(session, "/assets", {});
  }
  return fleetManagerRequest(session, "/assets/" + encodeURIComponent(asset_id), {});
}
