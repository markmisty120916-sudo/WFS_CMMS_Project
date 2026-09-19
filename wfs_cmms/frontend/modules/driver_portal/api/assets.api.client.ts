import { driverPortalRequest } from "./driver-portal.api.client";
import type { DriverPortalSession } from "../driver-portal.interface";

export async function getAssignedVehicle(session: DriverPortalSession | null, query: Readonly<Record<string, string>>): Promise<unknown> {
  return driverPortalRequest(session, "/driver/assigned-vehicle", query, "GET", null);
}
