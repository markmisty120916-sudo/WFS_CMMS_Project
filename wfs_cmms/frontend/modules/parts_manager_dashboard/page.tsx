"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { AimiInsightFeed } from "./components/AimiInsightFeed";
import { AwaitingPartsQueue } from "./components/AwaitingPartsQueue";
import { InventoryAlerts } from "./components/InventoryAlerts";
import { InventoryOverview } from "./components/InventoryOverview";
import { PartQuickActions } from "./components/PartQuickActions";
import { PartUsageHistory } from "./components/PartUsageHistory";
import { PartsFilters } from "./components/PartsFilters";
import { PredictivePartsInsights } from "./components/PredictivePartsInsights";
import { VendorManagementPanel } from "./components/VendorManagementPanel";
import type { PartsManagerFilter } from "./parts-manager-dashboard.interface";

export default function PartsManagerDashboardPage() {
  const [filter, setFilter] = useState<PartsManagerFilter>({
    vendor: "",
    part_category: "",
    stock_status: "",
    severity: "",
  });

  return (
    <div>
      <PartsFilters filter={filter} onChange={setFilter} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2" style={gridStyle}>
        <InventoryOverview filter={filter} />
        <AwaitingPartsQueue filter={filter} />
        <VendorManagementPanel filter={filter} />
        <PartUsageHistory filter={filter} />
        <PredictivePartsInsights filter={filter} />
        <InventoryAlerts filter={filter} />
        <PartQuickActions filter={filter} />
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
