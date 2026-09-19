import { driverPortalRequest } from "./driver-portal.api.client";
import type { DriverPortalSession } from "../driver-portal.interface";

export async function listDriverPm(session: DriverPortalSession | null, query: Readonly<Record<string, string>>): Promise<unknown> {
  return driverPortalRequest(session, "/driver/pm", query, "GET", null);
}
