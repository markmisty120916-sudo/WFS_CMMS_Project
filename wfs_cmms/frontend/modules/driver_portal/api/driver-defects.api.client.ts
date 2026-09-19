import { driverPortalRequest } from "./driver-portal.api.client";
import type { DriverPortalSession } from "../driver-portal.interface";

export async function listDriverDefects(session: DriverPortalSession | null, query: Readonly<Record<string, string>>): Promise<unknown> {
  return driverPortalRequest(session, "/driver/defect", query, "GET", null);
}

export async function submitDriverDefect(session: DriverPortalSession | null, body: Readonly<Record<string, string>>): Promise<unknown> {
  return driverPortalRequest(session, "/driver/defect", {}, "POST", body);
}
