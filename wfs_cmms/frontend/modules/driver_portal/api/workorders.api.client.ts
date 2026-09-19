import { driverPortalRequest } from "./driver-portal.api.client";
import type { DriverPortalSession } from "../driver-portal.interface";

export async function listDriverWorkorders(session: DriverPortalSession | null, query: Readonly<Record<string, string>>): Promise<unknown> {
  return driverPortalRequest(session, "/driver/workorders", query, "GET", null);
}

export async function addDriverWorkorderNote(session: DriverPortalSession | null, body: Readonly<Record<string, string>>): Promise<unknown> {
  return driverPortalRequest(session, "/driver/note", {}, "POST", body);
}

export async function addDriverWorkorderPhoto(session: DriverPortalSession | null, body: Readonly<Record<string, string>>): Promise<unknown> {
  return driverPortalRequest(session, "/driver/photo", {}, "POST", body);
}
