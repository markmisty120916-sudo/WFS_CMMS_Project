import { driverPortalRequest } from "./driver-portal.api.client";
import type { DriverPortalSession } from "../driver-portal.interface";

export async function listDriverAimiSafety(session: DriverPortalSession | null, query: Readonly<Record<string, string>>): Promise<unknown> {
  return driverPortalRequest(session, "/driver/aimi-safety", query, "GET", null);
}

export async function acknowledgeDriverAlert(session: DriverPortalSession | null, body: Readonly<Record<string, string>>): Promise<unknown> {
  return driverPortalRequest(session, "/driver/alert-ack", {}, "POST", body);
}
