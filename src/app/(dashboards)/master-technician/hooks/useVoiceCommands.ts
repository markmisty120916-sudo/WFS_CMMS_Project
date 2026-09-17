"use client";

import { useCallback, useEffect, useState } from "react";
import { MASTER_TECH_API_ROUTES, masterTechApiPath, masterTechApiRequest } from "../api/master-tech.api.contract";
import type { MasterTechLanguage, MasterTechSession, MasterTechVoiceResult } from "../master-tech.interface";
import { canUseMasterTechVoice } from "../master-tech.rbac";
import { mapVoiceResult } from "../utils/master-tech-mapper";
import { loadMasterTechSession } from "../utils/master-tech-normalizer";

export const MASTER_TECH_VOICE_COMMANDS: readonly string[] = Object.freeze([
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
  "Show compliance status.",
  "Show availability.",
  "Show scheduling window.",
  "Go to workorders.",
  "Go to assets.",
  "Go to diagnostics.",
  "Go to scheduling.",
  "Go to PM.",
  "Go to compliance.",
  "AIMI, explain this.",
]);

export function useVoiceCommands(language: MasterTechLanguage): {
  readonly session: MasterTechSession | null;
  readonly allowed: boolean;
  readonly commands: readonly string[];
  readonly result: MasterTechVoiceResult | null;
  readonly submit: (command_text: string) => Promise<void>;
} {
  const [session, setSession] = useState<MasterTechSession | null>(null);
  const [result, setResult] = useState<MasterTechVoiceResult | null>(null);

  useEffect(() => {
    setSession(loadMasterTechSession());
  }, []);

  const submit = useCallback(
    async (command_text: string) => {
      const current = loadMasterTechSession();
      setSession(current);
      if (current === null) {
        setResult(null);
        return;
      }
      if (canUseMasterTechVoice(current.role) === false) {
        setResult(null);
        return;
      }
      let matched = "";
      let index = 0;
      while (index < MASTER_TECH_VOICE_COMMANDS.length) {
        if (MASTER_TECH_VOICE_COMMANDS[index] === command_text) {
          matched = command_text;
        }
        index = index + 1;
      }
      if (matched === "") {
        setResult(null);
        return;
      }
      const route = MASTER_TECH_API_ROUTES[10];
      const payload = await masterTechApiRequest(
        current,
        route.operation,
        masterTechApiPath(route.path, {}),
        route.method,
        {},
        {
          command_text: matched,
          language,
          context: "master-technician-dashboard",
        },
      );
      setResult(mapVoiceResult(payload, current.tenant_id, matched, language));
    },
    [language],
  );

  const allowed = session !== null && canUseMasterTechVoice(session.role);
  return { session, allowed, commands: MASTER_TECH_VOICE_COMMANDS, result, submit };
}
