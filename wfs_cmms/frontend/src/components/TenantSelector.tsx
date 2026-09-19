import { useState } from "react";
import { loadRuntimeSession, saveRuntimeTenant } from "../api/client";
import { mutedStyle, panelStyle } from "./styles";

export function TenantSelector() {
  const session = loadRuntimeSession();
  const [tenantId, setTenantId] = useState(session === null ? "" : session.tenant_id);

  return (
    <section style={panelStyle}>
      <p style={mutedStyle}>Tenant</p>
      <input
        value={tenantId}
        onChange={(event) => {
          setTenantId(event.target.value);
        }}
        aria-label="tenant_id"
      />
      <button
        type="button"
        onClick={() => {
          saveRuntimeTenant(tenantId);
        }}
      >
        Store tenant_id
      </button>
      <p style={mutedStyle}>
        Requests use Authorization and X-Tenant-Id from the existing session token
        (wfs.cmms.token). Empty tenant_id is not sent as a bypass.
      </p>
    </section>
  );
}
