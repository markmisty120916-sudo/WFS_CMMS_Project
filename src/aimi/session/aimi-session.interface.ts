/**
 * AIMI Session Layer
 * Master Blueprint V2 / aimi.md §2 / TENANT-ISOLATION
 * Immutable session envelope. No invented lifecycle kinds or engine payloads.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type { AimiEngineName } from "../core/aimi-core-engine-map";
import type { AimiContext, AimiContextSource } from "../context/aimi-context.interface";

export type AimiSessionSource = AimiContextSource & {
  readonly session_id: string;
  readonly previous: AimiSession | null;
};

export type AimiSession = {
  readonly session_id: string;
  readonly previous_event_id: string;
  readonly tenant_id: string;
  readonly user_id: string;
  readonly role: DtoRole;
  readonly timestamp: string;
  readonly context: AimiContext;
  readonly engines_selected: readonly AimiEngineName[];
};

export type AimiSessionBuild = {
  readonly session: AimiSession;
};

export function freezeAimiSession(session: AimiSession): AimiSession {
  const engines: AimiEngineName[] = [];
  let index = 0;
  while (index < session.engines_selected.length) {
    engines.push(session.engines_selected[index]);
    index = index + 1;
  }
  return Object.freeze({
    session_id: session.session_id,
    previous_event_id: session.previous_event_id,
    tenant_id: session.tenant_id,
    user_id: session.user_id,
    role: session.role,
    timestamp: session.timestamp,
    context: session.context,
    engines_selected: Object.freeze(engines),
  });
}
