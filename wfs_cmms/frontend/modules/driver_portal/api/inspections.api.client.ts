import { driverPortalRequest } from "./driver-portal.api.client";
import type { DriverPortalSession } from "../driver-portal.interface";

export async function listDriverInspections(session: DriverPortalSession | null, query: Readonly<Record<string, string>>): Promise<unknown> {
  return driverPortalRequest(session, "/driver/inspections", query, "GET", null);
}
