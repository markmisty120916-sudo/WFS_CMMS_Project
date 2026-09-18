"use client";

import type { CSSProperties } from "react";
import { AssetEditor } from "./components/AssetEditor";
import { BulkUploadWizard } from "./components/BulkUploadWizard";
import { ConfigurationPackBuilder } from "./components/ConfigurationPackBuilder";
import { EmployeeEditor } from "./components/EmployeeEditor";
import { ImportHistory } from "./components/ImportHistory";
import { PartsEditor } from "./components/PartsEditor";
import { PmScheduleEditor } from "./components/PmScheduleEditor";
import { VendorEditor } from "./components/VendorEditor";

export default function AssetManagerPage() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2" style={gridStyle}>
      <BulkUploadWizard />
      <AssetEditor />
      <PartsEditor />
      <EmployeeEditor />
      <PmScheduleEditor />
      <VendorEditor />
      <ConfigurationPackBuilder />
      <ImportHistory />
    </div>
  );
}

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "16px",
};
