"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { AimiComplianceInsights } from "./components/AimiComplianceInsights";
import { AimiInsightFeed } from "./components/AimiInsightFeed";
import { ComplianceFilters } from "./components/ComplianceFilters";
import { ComplianceFindingsPanel } from "./components/ComplianceFindingsPanel";
import { DotCompliancePanel } from "./components/DotCompliancePanel";
import { DvirPanel } from "./components/DvirPanel";
import { InspectionOverview } from "./components/InspectionOverview";
import { MultilingualCompliancePanel } from "./components/MultilingualCompliancePanel";
import { SafetyWorkordersQueue } from "./components/SafetyWorkordersQueue";
import { SchoolDistrictCompliancePanel } from "./components/SchoolDistrictCompliancePanel";
import { VoiceCompliancePanel } from "./components/VoiceCompliancePanel";
import type { ComplianceDashboardFilter } from "./compliance-dashboard.interface";
import { canAccessComplianceDvirOnly } from "./compliance-dashboard.rbac";
import { loadComplianceDashboardSession } from "./hooks/useComplianceDashboardApi";

export default function ComplianceDashboardPage() {
  const [filter, setFilter] = useState<ComplianceDashboardFilter>({
    asset: "",
    inspection_type: "",
    severity: "",
    driver: "",
    technician: "",
    compliance_category: "",
  });
  const [dvirOnly, setDvirOnly] = useState(false);

  useEffect(() => {
    const session = loadComplianceDashboardSession();
    if (session !== null && canAccessComplianceDvirOnly(session.role) === true) {
      setDvirOnly(true);
    }
  }, []);

  return (
    <div>
      <ComplianceFilters filter={filter} onChange={setFilter} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2" style={gridStyle}>
        {dvirOnly === true ? (
          <DvirPanel filter={filter} />
        ) : (
          <>
            <InspectionOverview filter={filter} />
            <DvirPanel filter={filter} />
            <SafetyWorkordersQueue filter={filter} />
            <ComplianceFindingsPanel filter={filter} />
            <DotCompliancePanel filter={filter} />
            <SchoolDistrictCompliancePanel filter={filter} />
            <MultilingualCompliancePanel filter={filter} />
            <VoiceCompliancePanel filter={filter} />
            <AimiComplianceInsights filter={filter} />
            <AimiInsightFeed filter={filter} />
          </>
        )}
      </div>
    </div>
  );
}

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "16px",
};
