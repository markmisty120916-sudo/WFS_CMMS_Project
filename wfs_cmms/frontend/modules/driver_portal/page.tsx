"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { AssetStatusPanel } from "./components/AssetStatusPanel";
import { ComplianceStatusPanel } from "./components/ComplianceStatusPanel";
import { DefectReportingPanel } from "./components/DefectReportingPanel";
import { MultilingualToggle } from "./components/MultilingualToggle";
import { PmStatusPanel } from "./components/PmStatusPanel";
import { SafetyAlertsPanel } from "./components/SafetyAlertsPanel";
import { TelematicsFaultSummary } from "./components/TelematicsFaultSummary";
import { WorkorderVisibilityPanel } from "./components/WorkorderVisibilityPanel";
import type { DriverPortalFilter, DriverPortalLocale } from "./driver-portal.interface";
import { Input } from "./components/ui/controls";
import { stackStyle } from "./driver-portal.styles";

export default function DriverPortalPage() {
  const [filter, setFilter] = useState<DriverPortalFilter>({ asset: "" });
  const [locale, setLocale] = useState<DriverPortalLocale>("en");

  return (
    <div style={stackStyle} className="flex w-full max-w-xl flex-col gap-4">
      <MultilingualToggle locale={locale} onChange={setLocale} />
      <Input
        placeholder="asset"
        value={filter.asset}
        onChange={(event) => setFilter({ asset: event.target.value })}
      />
      <SafetyAlertsPanel filter={filter} locale={locale} />
      <AssetStatusPanel filter={filter} locale={locale} />
      <DefectReportingPanel filter={filter} locale={locale} />
      <PmStatusPanel filter={filter} locale={locale} />
      <ComplianceStatusPanel filter={filter} locale={locale} />
      <TelematicsFaultSummary filter={filter} locale={locale} />
      <WorkorderVisibilityPanel filter={filter} locale={locale} />
    </div>
  );
}

export const driverPortalPageStyle: CSSProperties = { width: "100%" };
