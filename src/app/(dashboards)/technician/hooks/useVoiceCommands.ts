"use client";

import { useCallback, useEffect, useState } from "react";
import { technicianApiPath, technicianApiRequest, technicianApiRoute } from "../api/technician.api.contract";
import type { TechnicianLanguage, TechnicianSession, TechnicianVoiceResult } from "../technician.interface";
import { canUseTechnicianVoice } from "../technician.rbac";
import { mapVoiceResult } from "../utils/technician-mapper";
import { loadTechnicianSession } from "../utils/technician-normalizer";

export const TECHNICIAN_VOICE_COMMANDS: readonly string[] = Object.freeze([
  "Add a note to this workorder.",
  "Add a photo to this workorder.",
  "Show recommended repair.",
  "Show verification steps.",
  "AIMI, diagnose this issue.",
  "Next step.",
  "Repeat step.",
  "Skip step.",
  "Explain this step.",
  "Show recommended parts.",
  "Show fault history.",
  "Show asset health.",
  "Show telematics data.",
  "Show predictive alerts.",
  "Show PM schedule.",
  "Start PM.",
  "Log PM findings.",
  "Complete PM.",
  "Show PM checklist.",
  "Go to workorders.",
  "Go to assets.",
  "Go to diagnostics.",
  "Go to PM.",
  "AIMI, explain this.",
]);

export function useVoiceCommands(language: TechnicianLanguage): {
  readonly session: TechnicianSession | null;
  readonly allowed: boolean;
  readonly commands: readonly string[];
  readonly result: TechnicianVoiceResult | null;
  readonly submit: (command_text: string) => Promise<void>;
} {
  const [session, setSession] = useState<TechnicianSession | null>(null);
  const [result, setResult] = useState<TechnicianVoiceResult | null>(null);

  useEffect(() => {
    setSession(loadTechnicianSession());
  }, []);

  const submit = useCallback(
    async (command_text: string) => {
      const current = loadTechnicianSession();
      setSession(current);
      if (current === null) {
        setResult(null);
        return;
      }
      if (canUseTechnicianVoice(current.role) === false) {
        setResult(null);
        return;
      }
      let matched = "";
      let index = 0;
      while (index < TECHNICIAN_VOICE_COMMANDS.length) {
        if (TECHNICIAN_VOICE_COMMANDS[index] === command_text) {
          matched = command_text;
        }
        index = index + 1;
      }
      if (matched === "") {
        setResult(null);
        return;
      }
      const route = technicianApiRoute("voice_command");
      if (route === null) {
        setResult(null);
        return;
      }
      const payload = await technicianApiRequest(
        current,
        route.operation,
        technicianApiPath(route.path, {}),
        route.method,
        {},
        {
          command_text: matched,
          language,
          context: "technician-dashboard",
        },
      );
      setResult(mapVoiceResult(payload, current.tenant_id, matched, language));
    },
    [language],
  );

  const allowed = session !== null && canUseTechnicianVoice(session.role);
  return { session, allowed, commands: TECHNICIAN_VOICE_COMMANDS, result, submit };
}
