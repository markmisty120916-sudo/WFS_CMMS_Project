import { driverPortalRequest } from "./driver-portal.api.client";
import type { DriverPortalSession } from "../driver-portal.interface";

export async function listDriverDvir(session: DriverPortalSession | null, query: Readonly<Record<string, string>>): Promise<unknown> {
  return driverPortalRequest(session, "/driver/dvir", query, "GET", null);
}

export async function submitDriverDvir(session: DriverPortalSession | null, body: Readonly<Record<string, string>>): Promise<unknown> {
  return driverPortalRequest(session, "/driver/dvir", {}, "POST", body);
}
