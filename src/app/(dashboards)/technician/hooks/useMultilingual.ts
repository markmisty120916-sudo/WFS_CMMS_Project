"use client";

import { useCallback, useEffect, useState } from "react";
import { technicianApiPath, technicianApiRequest, technicianApiRoute } from "../api/technician.api.contract";
import type { TechnicianLanguage, TechnicianSession, TechnicianTranslationResult } from "../technician.interface";
import { canUseTechnicianMultilingual } from "../technician.rbac";
import { mapTranslationResult } from "../utils/technician-mapper";
import { isTechnicianLanguage, loadTechnicianSession } from "../utils/technician-normalizer";

export const TECHNICIAN_LANGUAGES: readonly TechnicianLanguage[] = Object.freeze([
  "English",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Mandarin",
  "Arabic",
]);

export function useMultilingual(): {
  readonly session: TechnicianSession | null;
  readonly allowed: boolean;
  readonly language: TechnicianLanguage;
  readonly languages: readonly TechnicianLanguage[];
  readonly translation: TechnicianTranslationResult | null;
  readonly setLanguage: (language: TechnicianLanguage) => void;
  readonly translate: (text: string, target_language: TechnicianLanguage) => Promise<void>;
} {
  const [session, setSession] = useState<TechnicianSession | null>(null);
  const [language, setLanguageState] = useState<TechnicianLanguage>("English");
  const [translation, setTranslation] = useState<TechnicianTranslationResult | null>(null);

  useEffect(() => {
    setSession(loadTechnicianSession());
  }, []);

  const setLanguage = useCallback((next: TechnicianLanguage) => {
    if (isTechnicianLanguage(next) === true) {
      setLanguageState(next);
    }
  }, []);

  const translate = useCallback(
    async (text: string, target_language: TechnicianLanguage) => {
      const current = loadTechnicianSession();
      setSession(current);
      if (current === null) {
        setTranslation(null);
        return;
      }
      if (canUseTechnicianMultilingual(current.role) === false) {
        setTranslation(null);
        return;
      }
      if (isTechnicianLanguage(target_language) === false) {
        setTranslation(null);
        return;
      }
      const route = technicianApiRoute("translate");
      if (route === null) {
        setTranslation(null);
        return;
      }
      const payload = await technicianApiRequest(
        current,
        route.operation,
        technicianApiPath(route.path, {}),
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

  const allowed = session !== null && canUseTechnicianMultilingual(session.role);
  return {
    session,
    allowed,
    language,
    languages: TECHNICIAN_LANGUAGES,
    translation,
    setLanguage,
    translate,
  };
}
