import { silentMasterKeyRequest } from "./silent-master-key-dashboard.api.client";
import type { SilentMasterKeySession } from "../silent-master-key-dashboard.interface";

export async function listSilentMasterKeyWorkorders(session: SilentMasterKeySession | null, query: Readonly<Record<string, string>>): Promise<unknown> {
  return silentMasterKeyRequest(session, "/silent-master-key/workorders", query, "GET", null);
}

export async function submitSeverityOverride(session: SilentMasterKeySession | null, body: Readonly<Record<string, string>>): Promise<unknown> {
  return silentMasterKeyRequest(session, "/silent-master-key/severity-override", {}, "POST", body);
}

export async function submitRoutingOverride(session: SilentMasterKeySession | null, body: Readonly<Record<string, string>>): Promise<unknown> {
  return silentMasterKeyRequest(session, "/silent-master-key/routing-override", {}, "POST", body);
}

export async function submitSchedulingOverride(session: SilentMasterKeySession | null, body: Readonly<Record<string, string>>): Promise<unknown> {
  return silentMasterKeyRequest(session, "/silent-master-key/scheduling-override", {}, "POST", body);
}
