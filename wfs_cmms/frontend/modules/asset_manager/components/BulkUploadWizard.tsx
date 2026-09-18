"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { useAssetManagerApi } from "../hooks/useAssetManagerApi";
import { mutedStyle, panelStyle, rowStyle, titleStyle } from "../asset-manager.styles";
import { Button, Input, Select, Textarea } from "./ui/controls";

const DATA_TYPES = ["vehicles", "parts", "employees", "pms", "vendors", "config_packs"] as const;
const STEPS = [
  "Select data type",
  "Upload file",
  "Column mapping",
  "AIMI validation results",
  "Preview",
  "Commit",
] as const;

type ImportPayload = {
  ok?: boolean;
  value?: {
    import_id?: string;
    status?: string;
    audit_summary?: string;
    rows?: readonly { row_index: string; action: string; reason: string; payload: Record<string, string> }[];
  };
};

function asImport(value: unknown): ImportPayload | null {
  if (value === null || typeof value !== "object") {
    return null;
  }
  return value as ImportPayload;
}

export function BulkUploadWizard() {
  const api = useAssetManagerApi();
  const [step, setStep] = useState(1);
  const [data_type, setDataType] = useState<(typeof DATA_TYPES)[number]>("vehicles");
  const [file_format, setFileFormat] = useState<"csv" | "xlsx" | "json">("csv");
  const [content, setContent] = useState("");
  const [import_id, setImportId] = useState("");
  const [source_column, setSource] = useState("");
  const [target_field, setTarget] = useState("");
  const [record, setRecord] = useState<ImportPayload | null>(null);

  if (api.allowed === false) {
    return null;
  }

  const rows = record && record.value && record.value.rows ? record.value.rows : [];

  return (
    <section className="rounded-xl border border-violet-600 p-4" style={panelStyle}>
      <h2 style={titleStyle}>Bulk Upload Wizard</h2>
      <p style={mutedStyle}>
        Step {String(step)} of 6 — {STEPS[step - 1]}
      </p>
      {step === 1 ? (
        <Select value={data_type} onChange={(event) => setDataType(event.target.value as (typeof DATA_TYPES)[number])}>
          {DATA_TYPES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      ) : null}
      {step === 2 ? (
        <>
          <Select value={file_format} onChange={(event) => setFileFormat(event.target.value as "csv" | "xlsx" | "json")}>
            <option value="csv">csv</option>
            <option value="xlsx">xlsx</option>
            <option value="json">json</option>
          </Select>
          <Textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="csv / tsv / json body" />
        </>
      ) : null}
      {step === 3 ? (
        <>
          <p style={mutedStyle}>Map source columns to Asset Manager fields. Empty map uses schema names.</p>
          <Input value={source_column} onChange={(event) => setSource(event.target.value)} placeholder="source_column" />
          <Input value={target_field} onChange={(event) => setTarget(event.target.value)} placeholder="target_field" />
        </>
      ) : null}
      {step === 4 ? (
        <div>
          <p style={mutedStyle}>AIMI VIN, PM interval, severity threshold, and duplicate checks</p>
          {rows.map((row) => (
            <p key={row.row_index} style={row.action === "reject" ? rejectStyle : mutedStyle}>
              row {row.row_index} {row.action} {row.reason}
            </p>
          ))}
        </div>
      ) : null}
      {step === 5 ? (
        <div>
          <p style={mutedStyle}>{record && record.value ? record.value.audit_summary : "preview"}</p>
          {rows.map((row) => (
            <p key={row.row_index} style={mutedStyle}>
              {row.action.toUpperCase()} {row.row_index} {row.reason}
            </p>
          ))}
        </div>
      ) : null}
      {step === 6 ? (
        <p style={mutedStyle}>audit {record && record.value ? record.value.audit_summary : ""} status {record && record.value ? record.value.status : ""}</p>
      ) : null}
      <div style={rowStyle}>
        {step > 1 ? (
          <Button type="button" onClick={() => setStep(step - 1)}>
            back
          </Button>
        ) : null}
        <Button
          type="button"
          onClick={() => {
            void (async () => {
              if (step === 2) {
                const uploaded = asImport(
                  await api.request("POST", "/asset-manager/imports/upload", {
                    data_type,
                    file_format,
                    file_name: "upload." + file_format,
                    content,
                  }),
                );
                if (uploaded && uploaded.value && uploaded.value.import_id) {
                  setImportId(uploaded.value.import_id);
                  setRecord(uploaded);
                }
              }
              if (step === 3 && import_id !== "") {
                const column_map =
                  source_column !== "" && target_field !== ""
                    ? [{ source_column, target_field }]
                    : [];
                const validated = asImport(await api.request("POST", "/asset-manager/imports/" + import_id + "/validate", { column_map }));
                setRecord(validated);
              }
              if (step === 4 && import_id !== "") {
                const current = asImport(await api.request("GET", "/asset-manager/imports/" + import_id, {}));
                setRecord(current);
              }
              if (step === 5 && import_id !== "") {
                const previewed = asImport(await api.request("POST", "/asset-manager/imports/" + import_id + "/preview", {}));
                setRecord(previewed);
              }
              if (step === 6 && import_id !== "") {
                const committed = asImport(await api.request("POST", "/asset-manager/imports/" + import_id + "/commit", {}));
                setRecord(committed);
                return;
              }
              if (step < 6) {
                setStep(step + 1);
              }
            })();
          }}
        >
          {step === 6 ? "commit" : "next"}
        </Button>
      </div>
    </section>
  );
}

const rejectStyle: CSSProperties = { color: "#22d3ee", margin: "4px 0" };
