"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { useAssetManagerApi } from "../hooks/useAssetManagerApi";

const DATA_TYPES = ["vehicles", "parts", "employees", "pms", "vendors", "config_packs"] as const;

export function BulkUploadWizard() {
  const api = useAssetManagerApi();
  const [step, setStep] = useState(1);
  const [data_type, setDataType] = useState<(typeof DATA_TYPES)[number]>("vehicles");
  const [file_format, setFileFormat] = useState<"csv" | "xlsx" | "json">("csv");
  const [content, setContent] = useState("");
  const [import_id, setImportId] = useState("");
  const [preview, setPreview] = useState<unknown>(null);

  if (api.allowed === false) {
    return null;
  }

  return (
    <section style={panelStyle}>
      <h2 style={titleStyle}>Bulk Upload Wizard</h2>
      <p style={mutedStyle}>Step {String(step)} of 6</p>
      {step === 1 ? (
        <select style={inputStyle} value={data_type} onChange={(event) => setDataType(event.target.value as (typeof DATA_TYPES)[number])}>
          {DATA_TYPES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      ) : null}
      {step === 2 ? (
        <>
          <select style={inputStyle} value={file_format} onChange={(event) => setFileFormat(event.target.value as "csv" | "xlsx" | "json")}>
            <option value="csv">csv</option>
            <option value="xlsx">xlsx</option>
            <option value="json">json</option>
          </select>
          <textarea style={areaStyle} value={content} onChange={(event) => setContent(event.target.value)} />
        </>
      ) : null}
      {step === 3 ? <p style={mutedStyle}>column map uses schema field names. AIMI checks VIN, PM intervals, severity, and duplicate VIN.</p> : null}
      {step === 4 || step === 5 ? <pre style={preStyle}>{JSON.stringify(preview, null, 2)}</pre> : null}
      {step === 6 ? <p style={mutedStyle}>commit writes tenant-scoped rows with IntegrationLogs audit summary</p> : null}
      <div style={rowStyle}>
        {step > 1 ? (
          <button style={buttonStyle} type="button" onClick={() => setStep(step - 1)}>
            back
          </button>
        ) : null}
        <button
          style={buttonStyle}
          type="button"
          onClick={() => {
            void (async () => {
              if (step === 2) {
                const uploaded = (await api.request("POST", "/asset-manager/imports/upload", {
                  data_type,
                  file_format,
                  file_name: "upload." + file_format,
                  content,
                })) as { value?: { import_id?: string } } | null;
                if (uploaded && uploaded.value && uploaded.value.import_id) {
                  setImportId(uploaded.value.import_id);
                }
              }
              if (step === 3 && import_id !== "") {
                await api.request("POST", "/asset-manager/imports/" + import_id + "/validate", { column_map: [] });
              }
              if (step === 4 && import_id !== "") {
                const validated = await api.request("POST", "/asset-manager/imports/" + import_id + "/validate", { column_map: [] });
                setPreview(validated);
              }
              if (step === 5 && import_id !== "") {
                const previewed = await api.request("POST", "/asset-manager/imports/" + import_id + "/preview", {});
                setPreview(previewed);
              }
              if (step === 6 && import_id !== "") {
                const committed = await api.request("POST", "/asset-manager/imports/" + import_id + "/commit", {});
                setPreview(committed);
              }
              if (step < 6) {
                setStep(step + 1);
              }
            })();
          }}
        >
          {step === 6 ? "commit" : "next"}
        </button>
      </div>
    </section>
  );
}

const panelStyle: CSSProperties = {
  background: "#12081f",
  border: "1px solid #7c3aed",
  boxShadow: "0 0 18px #7c3aed66",
  borderRadius: "12px",
  padding: "16px",
  color: "#f5f3ff",
};

const titleStyle: CSSProperties = {
  color: "#c084fc",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const mutedStyle: CSSProperties = { color: "#c4b5fd" };
const inputStyle: CSSProperties = {
  background: "#05010d",
  border: "1px solid #a855f7",
  color: "#f5f3ff",
  borderRadius: "8px",
  padding: "8px",
  width: "100%",
  marginBottom: "8px",
};
const areaStyle: CSSProperties = { ...inputStyle, minHeight: "160px" };
const preStyle: CSSProperties = { overflow: "auto", maxHeight: "240px", color: "#22d3ee" };
const rowStyle: CSSProperties = { display: "flex", gap: "8px" };
const buttonStyle: CSSProperties = {
  color: "#05010d",
  background: "#c084fc",
  border: "none",
  borderRadius: "8px",
  padding: "10px 16px",
  fontWeight: 700,
};
