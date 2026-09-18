"use client";

import type { CSSProperties } from "react";
import { AssetEditor } from "./components/AssetEditor";
import { BulkUploadWizard } from "./components/BulkUploadWizard";
import { ConfigurationPackBuilder } from "./components/ConfigurationPackBuilder";
import { EmployeeEditor } from "./components/EmployeeEditor";
import { ImportHistory } from "./components/ImportHistory";
import { PartsEditor } from "./components/PartsEditor";
import { PmScheduleEditor } from "./components/PmScheduleEditor";

export default function AssetManagerPage() {
  return (
    <div style={gridStyle}>
      <BulkUploadWizard />
      <AssetEditor />
      <PartsEditor />
      <EmployeeEditor />
      <PmScheduleEditor />
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
