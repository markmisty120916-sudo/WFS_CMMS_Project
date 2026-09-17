"use client";

import type { CSSProperties } from "react";
import { useMultilingual } from "../hooks/useMultilingual";
import { isMasterTechLanguage } from "../utils/master-tech-normalizer";
import { masterTechWidgetLabel } from "../master-tech.widgets";

export function MultilingualToggle() {
  const multilingual = useMultilingual();

  return (
    <section style={panelStyle}>
      <h2 style={titleStyle}>{masterTechWidgetLabel("multilingual")}</h2>
      <select
        style={inputStyle}
        value={multilingual.language}
        onChange={(event) => {
          if (isMasterTechLanguage(event.target.value) === true) {
            multilingual.setLanguage(event.target.value);
          }
        }}
      >
        {multilingual.languages.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
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
  minHeight: "120px",
};

const titleStyle: CSSProperties = {
  color: "#c084fc",
  margin: "0 0 12px 0",
  fontSize: "18px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const inputStyle: CSSProperties = {
  background: "#05010d",
  border: "1px solid #a855f7",
  color: "#f5f3ff",
  borderRadius: "8px",
  padding: "8px",
  width: "100%",
};
