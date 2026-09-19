"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { AimiVisibilityPanel } from "./components/AimiVisibilityPanel";
import { DashboardSwitchingPanel } from "./components/DashboardSwitchingPanel";
import { DiagnosticVisibilityPanel } from "./components/DiagnosticVisibilityPanel";
import { PredictiveVisibilityPanel } from "./components/PredictiveVisibilityPanel";
import { RoutingOverridePanel } from "./components/RoutingOverridePanel";
import { SchedulingOverridePanel } from "./components/SchedulingOverridePanel";
import { SeverityOverridePanel } from "./components/SeverityOverridePanel";
import { Input } from "./components/ui/controls";
import type { SilentMasterKeyFilter } from "./silent-master-key-dashboard.interface";
import { filterRowStyle } from "./silent-master-key-dashboard.styles";

export default function SilentMasterKeyDashboardPage() {
  const [filter, setFilter] = useState<SilentMasterKeyFilter>({
    asset: "",
    workorder_id: "",
  });

  return (
    <div>
      <div style={filterRowStyle}>
        <Input placeholder="asset" value={filter.asset} onChange={(event) => setFilter({ ...filter, asset: event.target.value })} />
        <Input
          placeholder="workorder_id"
          value={filter.workorder_id}
          onChange={(event) => setFilter({ ...filter, workorder_id: event.target.value })}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2" style={gridStyle}>
        <DashboardSwitchingPanel filter={filter} />
        <AimiVisibilityPanel filter={filter} />
        <PredictiveVisibilityPanel filter={filter} />
        <DiagnosticVisibilityPanel filter={filter} />
        <SeverityOverridePanel filter={filter} />
        <RoutingOverridePanel filter={filter} />
        <SchedulingOverridePanel filter={filter} />
      </div>
    </div>
  );
}

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "16px",
};
