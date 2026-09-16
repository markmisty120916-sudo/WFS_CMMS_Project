/**
 * AIMI Session Layer
 * Master Blueprint V2 / aimi.md §2 / BACKEND-STRUCTURE §6
 * Factory only. No Nest runtime. No global AIMI Session instance.
 */

import { AimiSessionService, type AimiSessionServiceOptions } from "./aimi-session.service";

export class AimiSessionModule {
  static create(options: AimiSessionServiceOptions): AimiSessionService {
    return new AimiSessionService(options);
  }
}

export { AimiSessionService } from "./aimi-session.service";
export type { AimiSessionServiceOptions } from "./aimi-session.service";
export type {
  AimiSession,
  AimiSessionBuild,
  AimiSessionSource,
} from "./aimi-session.interface";
export { freezeAimiSession } from "./aimi-session.interface";
export { buildAimiSession } from "./aimi-session-builder";
export type { AimiSessionBuildResult } from "./aimi-session-builder";
export {
  isSessionTerminal,
  isTerminalLifecycleState,
  isTerminalSnapshot,
  sessionIdentityError,
  snapshotContinuityError,
} from "./aimi-session-rules";
export { incomingEventFromAimiSession } from "./aimi-session-events";
