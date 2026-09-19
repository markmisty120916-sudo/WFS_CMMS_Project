"use client";

import { useEffect, useState } from "react";
import {
  RELEASE_PREP_CLIENT_ROUTES,
  releasePreflightLocal,
  reportReleaseStartup,
} from "../global-dashboard-integration.release-prep";
import { useGlobalDashboardIntegrationApi } from "../hooks/useGlobalDashboardIntegrationApi";
import { ReleaseFallbackState } from "./ReleaseFallbackState";

export function ReleasePreflightBanner() {
  const api = useGlobalDashboardIntegrationApi();
  const [reason, setReason] = useState("");

  useEffect(() => {
    const local = releasePreflightLocal();
    if (local.ok === false) {
      setReason(local.reason);
      reportReleaseStartup("preflight", local.reason);
      return;
    }
    reportReleaseStartup("startup", "frontend dashboards");
    if (api.allowed === false) {
      return;
    }
    void (async () => {
      const payload = (await api.request(RELEASE_PREP_CLIENT_ROUTES.ready)) as { ready?: string } | null;
      if (payload === null || payload.ready !== "ok") {
        setReason("ready");
        reportReleaseStartup("preflight", "ready");
        return;
      }
      reportReleaseStartup("preflight", "ok");
    })();
  }, [api.allowed, api.request]);

  if (reason !== "") {
    return <ReleaseFallbackState reason={reason} />;
  }
  return null;
}
