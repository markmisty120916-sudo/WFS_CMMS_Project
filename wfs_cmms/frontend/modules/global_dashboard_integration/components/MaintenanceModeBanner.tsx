"use client";

import { useEffect, useState } from "react";
import { isMaintenanceMode } from "../global-dashboard-integration.hardening";
import { mutedStyle, panelStyle, titleStyle } from "../global-dashboard-integration.styles";
import { integrationWidgetLabel } from "../global-dashboard-integration.widgets";
import { useGlobalDashboardIntegrationApi } from "../hooks/useGlobalDashboardIntegrationApi";

export function MaintenanceModeBanner() {
  const api = useGlobalDashboardIntegrationApi();
  const [maintenance, setMaintenance] = useState(isMaintenanceMode());

  useEffect(() => {
    if (api.allowed === false) {
      return;
    }
    void (async () => {
      const payload = (await api.request(api.routes.health)) as { maintenance?: string } | null;
      if (payload && payload.maintenance === "on") {
        setMaintenance(true);
      }
    })();
  }, [api.allowed, api.request, api.routes.health]);

  if (maintenance === false) {
    return null;
  }
  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>{integrationWidgetLabel("maintenance")}</h2>
      <p style={mutedStyle}>{integrationWidgetLabel("maintenance_body")}</p>
    </section>
  );
}
