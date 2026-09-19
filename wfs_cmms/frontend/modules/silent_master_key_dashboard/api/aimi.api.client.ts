import { silentMasterKeyRequest } from "./silent-master-key-dashboard.api.client";
import type { SilentMasterKeySession } from "../silent-master-key-dashboard.interface";

export async function listSilentMasterKeyAimi(session: SilentMasterKeySession | null, query: Readonly<Record<string, string>>): Promise<unknown> {
  return silentMasterKeyRequest(session, "/silent-master-key/aimi", query, "GET", null);
}

export async function listSilentMasterKeyPredictive(session: SilentMasterKeySession | null, query: Readonly<Record<string, string>>): Promise<unknown> {
  return silentMasterKeyRequest(session, "/silent-master-key/predictive", query, "GET", null);
}

export async function listSilentMasterKeyDiagnostics(session: SilentMasterKeySession | null, query: Readonly<Record<string, string>>): Promise<unknown> {
  return silentMasterKeyRequest(session, "/silent-master-key/diagnostics", query, "GET", null);
}
