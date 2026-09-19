import { useEffect, useState } from "react";
import { getLockedPath } from "../api/client";
import { mutedStyle, panelStyle, preStyle } from "../components/styles";

export function LockedPathPanel(props: { readonly title: string; readonly paths: readonly string[] }) {
  const [rows, setRows] = useState<readonly { path: string; payload: unknown }[]>([]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const next: { path: string; payload: unknown }[] = [];
      let index = 0;
      while (index < props.paths.length) {
        const path = props.paths[index];
        const payload = await getLockedPath(path);
        next.push({ path, payload });
        index = index + 1;
      }
      if (cancelled === false) {
        setRows(next);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [props.paths]);

  return (
    <div>
      <h1>{props.title}</h1>
      {rows.map((row) => (
        <section key={row.path} style={panelStyle}>
          <p style={mutedStyle}>{row.path}</p>
          <pre style={preStyle}>{JSON.stringify(row.payload, null, 2)}</pre>
        </section>
      ))}
    </div>
  );
}
