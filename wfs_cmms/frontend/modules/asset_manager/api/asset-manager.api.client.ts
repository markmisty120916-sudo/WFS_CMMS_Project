export const ASSET_MANAGER_API_BASE = "/v1";

export const ASSET_MANAGER_API_HEADERS = Object.freeze({
  authorization: "Authorization",
  tenant: "X-Tenant-Id",
  content_type: "Content-Type",
});

export type AssetManagerClientSession = {
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: string;
  readonly token: string;
};

export async function assetManagerRequest(
  session: AssetManagerClientSession | null,
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body: unknown,
): Promise<unknown> {
  if (session === null) {
    return null;
  }
  if (session.tenant_id === "") {
    return null;
  }
  const headers: Record<string, string> = {};
  headers[ASSET_MANAGER_API_HEADERS.authorization] = "Bearer " + session.token;
  headers[ASSET_MANAGER_API_HEADERS.tenant] = session.tenant_id;
  headers[ASSET_MANAGER_API_HEADERS.content_type] = "application/json";
  const init: RequestInit = { method, headers };
  if (method !== "GET") {
    init.body = JSON.stringify(body);
  }
  const response = await fetch(ASSET_MANAGER_API_BASE + path, init);
  if (response.ok === false) {
    return null;
  }
  return response.json();
}
