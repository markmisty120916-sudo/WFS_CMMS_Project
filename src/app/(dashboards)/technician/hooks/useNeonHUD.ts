"use client";

import { useCallback, useEffect, useState } from "react";
import type { TechnicianHudState, TechnicianLanguage, TechnicianSession } from "../technician.interface";
import { canUseTechnicianHud } from "../technician.rbac";
import { loadTechnicianSession } from "../utils/technician-normalizer";

export function useNeonHUD(language: TechnicianLanguage, voice_enabled: boolean, multilingual_enabled: boolean): {
  readonly session: TechnicianSession | null;
  readonly allowed: boolean;
  readonly hud: TechnicianHudState;
  readonly toggleHud: () => void;
} {
  const [session, setSession] = useState<TechnicianSession | null>(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setSession(loadTechnicianSession());
  }, []);

  const toggleHud = useCallback(() => {
    const current = loadTechnicianSession();
    setSession(current);
    if (current === null) {
      return;
    }
    if (canUseTechnicianHud(current.role) === false) {
      return;
    }
    setEnabled((currentEnabled) => currentEnabled === false);
  }, []);

  const allowed = session !== null && canUseTechnicianHud(session.role);
  const hud: TechnicianHudState = {
    enabled: allowed === true && enabled === true,
    voice_enabled: allowed === true && voice_enabled === true,
    multilingual_enabled: allowed === true && multilingual_enabled === true,
    language,
  };
  return { session, allowed, hud, toggleHud };
}
