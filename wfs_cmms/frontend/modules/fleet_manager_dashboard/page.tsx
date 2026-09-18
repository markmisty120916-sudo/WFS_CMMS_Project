"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { AimiInsightFeed } from "./components/AimiInsightFeed";
import { AssetQuickActions } from "./components/AssetQuickActions";
import { BreakdownQueue } from "./components/BreakdownQueue";
import { FindVehicleMap } from "./components/FindVehicleMap";
import { FleetFilters } from "./components/FleetFilters";
import { FleetHealthOverview } from "./components/FleetHealthOverview";
import { InventoryImpactPanel } from "./components/InventoryImpactPanel";
import { PmCompliancePanel } from "./components/PmCompliancePanel";
import { TechnicianWorkloadPanel } from "./components/TechnicianWorkloadPanel";
import type { FleetManagerFilter } from "./fleet-manager-dashboard.interface";

export default function FleetManagerDashboardPage() {
  const [filter, setFilter] = useState<FleetManagerFilter>({
    severity: "",
    asset_group: "",
    technician: "",
    pm_status: "",
    vendor: "",
  });

  return (
    <div>
      <FleetFilters filter={filter} onChange={setFilter} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2" style={gridStyle}>
        <FleetHealthOverview filter={filter} />
        <BreakdownQueue filter={filter} />
        <PmCompliancePanel filter={filter} />
        <InventoryImpactPanel filter={filter} />
        <TechnicianWorkloadPanel filter={filter} />
        <FindVehicleMap filter={filter} />
        <AssetQuickActions filter={filter} />
        <AimiInsightFeed filter={filter} />
      </div>
    </div>
  );
}

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "16px",
};
