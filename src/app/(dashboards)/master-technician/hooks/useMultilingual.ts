"use client";

import { useCallback, useEffect, useState } from "react";
import { MASTER_TECH_API_ROUTES, masterTechApiPath, masterTechApiRequest } from "../api/master-tech.api.contract";
import type { MasterTechLanguage, MasterTechSession, MasterTechTranslationResult } from "../master-tech.interface";
import { canUseMasterTechMultilingual } from "../master-tech.rbac";
import { mapTranslationResult } from "../utils/master-tech-mapper";
import { isMasterTechLanguage, loadMasterTechSession } from "../utils/master-tech-normalizer";

export const MASTER_TECH_LANGUAGES: readonly MasterTechLanguage[] = Object.freeze([
  "English",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Mandarin",
  "Arabic",
]);

export function useMultilingual(): {
  readonly session: MasterTechSession | null;
  readonly allowed: boolean;
  readonly language: MasterTechLanguage;
  readonly languages: readonly MasterTechLanguage[];
  readonly translation: MasterTechTranslationResult | null;
  readonly setLanguage: (language: MasterTechLanguage) => void;
  readonly translate: (text: string, target_language: MasterTechLanguage) => Promise<void>;
} {
  const [session, setSession] = useState<MasterTechSession | null>(null);
  const [language, setLanguageState] = useState<MasterTechLanguage>("English");
  const [translation, setTranslation] = useState<MasterTechTranslationResult | null>(null);

  useEffect(() => {
    setSession(loadMasterTechSession());
  }, []);

  const setLanguage = useCallback((next: MasterTechLanguage) => {
    if (isMasterTechLanguage(next) === true) {
      setLanguageState(next);
    }
  }, []);

  const translate = useCallback(
    async (text: string, target_language: MasterTechLanguage) => {
      const current = loadMasterTechSession();
      setSession(current);
      if (current === null) {
        setTranslation(null);
        return;
      }
      if (canUseMasterTechMultilingual(current.role) === false) {
        setTranslation(null);
        return;
      }
      if (isMasterTechLanguage(target_language) === false) {
        setTranslation(null);
        return;
      }
      const route = MASTER_TECH_API_ROUTES[11];
      const payload = await masterTechApiRequest(
        current,
        route.operation,
        masterTechApiPath(route.path, {}),
        route.method,
        {},
        {
          text,
          source_language: language,
          target_language,
        },
      );
      setTranslation(mapTranslationResult(payload, current.tenant_id, language, target_language, text));
    },
    [language],
  );

  const allowed = session !== null && canUseMasterTechMultilingual(session.role);
  return {
    session,
    allowed,
    language,
    languages: MASTER_TECH_LANGUAGES,
    translation,
    setLanguage,
    translate,
  };
}
