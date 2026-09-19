import { silentMasterKeyRequest } from "./silent-master-key-dashboard.api.client";
import type { SilentMasterKeySession } from "../silent-master-key-dashboard.interface";

export async function listSilentMasterKeyDashboards(session: SilentMasterKeySession | null): Promise<unknown> {
  return silentMasterKeyRequest(session, "/silent-master-key/dashboards", {}, "GET", null);
}
