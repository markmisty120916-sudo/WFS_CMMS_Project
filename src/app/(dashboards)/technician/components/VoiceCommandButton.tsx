"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { useMultilingual } from "../hooks/useMultilingual";
import { useVoiceCommands } from "../hooks/useVoiceCommands";
import { technicianWidgetLabel } from "../technician.widgets";

export function VoiceCommandButton() {
  const multilingual = useMultilingual();
  const voice = useVoiceCommands(multilingual.language);
  const [command, setCommand] = useState(voice.commands[0]);

  if (voice.session !== null && voice.allowed === false) {
    return null;
  }

  return (
    <section style={panelStyle}>
      <h2 style={titleStyle}>{technicianWidgetLabel("voice_commands")}</h2>
      <select
        style={inputStyle}
        value={command}
        onChange={(event) => {
          setCommand(event.target.value);
        }}
      >
        {voice.commands.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <button
        style={buttonStyle}
        type="button"
        onClick={() => {
          void voice.submit(command);
        }}
      >
        Voice Command
      </button>
      {voice.result !== null ? (
        <p style={mutedStyle}>{voice.result.processed === true ? voice.result.command_text : "voice.command.failed"}</p>
      ) : null}
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
  minHeight: "160px",
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
  marginBottom: "8px",
};

const buttonStyle: CSSProperties = {
  color: "#05010d",
  background: "#c084fc",
  boxShadow: "0 0 12px #c084fc",
  border: "none",
  borderRadius: "8px",
  padding: "10px 16px",
  fontWeight: 700,
  cursor: "pointer",
};

const mutedStyle: CSSProperties = {
  margin: "8px 0 0 0",
  color: "#c4b5fd",
};
