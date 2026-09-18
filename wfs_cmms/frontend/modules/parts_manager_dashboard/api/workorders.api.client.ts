import { partsManagerRequest } from "./parts-manager-dashboard.api.client";
import type { PartsManagerSession } from "../parts-manager-dashboard.interface";

export async function listAwaitingPartsWorkorders(session: PartsManagerSession | null, query: Readonly<Record<string, string>>): Promise<unknown> {
  return partsManagerRequest(session, "/parts/awaiting-parts", query);
}

export async function listPartsWorkorders(session: PartsManagerSession | null, query: Readonly<Record<string, string>>): Promise<unknown> {
  return partsManagerRequest(session, "/workorders", query);
}
