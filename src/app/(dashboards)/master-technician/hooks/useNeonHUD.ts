"use client";

import { useCallback, useEffect, useState } from "react";
import type { MasterTechHudState, MasterTechLanguage, MasterTechSession } from "../master-tech.interface";
import { canUseMasterTechHud } from "../master-tech.rbac";
import { loadMasterTechSession } from "../utils/master-tech-normalizer";

export function useNeonHUD(language: MasterTechLanguage, voice_enabled: boolean, multilingual_enabled: boolean): {
  readonly session: MasterTechSession | null;
  readonly allowed: boolean;
  readonly hud: MasterTechHudState;
  readonly toggleHud: () => void;
} {
  const [session, setSession] = useState<MasterTechSession | null>(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const current = loadMasterTechSession();
    setSession(current);
  }, []);

  const toggleHud = useCallback(() => {
    const current = loadMasterTechSession();
    setSession(current);
    if (current === null) {
      return;
    }
    if (canUseMasterTechHud(current.role) === false) {
      return;
    }
    setEnabled((currentEnabled) => currentEnabled === false);
  }, []);

  const allowed = session !== null && canUseMasterTechHud(session.role);
  const hud: MasterTechHudState = {
    enabled: allowed === true && enabled === true,
    voice_enabled: allowed === true && voice_enabled === true,
    multilingual_enabled: allowed === true && multilingual_enabled === true,
    language,
  };
  return { session, allowed, hud, toggleHud };
}
