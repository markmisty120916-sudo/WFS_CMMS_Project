import { partsManagerRequest } from "./parts-manager-dashboard.api.client";
import type { PartsManagerSession } from "../parts-manager-dashboard.interface";

export async function listPartsInventory(session: PartsManagerSession | null, query: Readonly<Record<string, string>>): Promise<unknown> {
  return partsManagerRequest(session, "/parts", query);
}
