/**
 * AIMI Session Layer
 * Master Blueprint V2 / aimi.md §2 / cursor-instructions §10
 * Deterministic freeze of coded session identity. No assumed transitions.
 */

import type { ErrorType } from "../../core/errors/error-types";
import { buildAimiContext } from "../context/aimi-context-builder";
import {
  sessionIdentityError,
  snapshotContinuityError,
} from "./aimi-session-rules";
import {
  freezeAimiSession,
  type AimiSessionBuild,
  type AimiSessionSource,
} from "./aimi-session.interface";

export type AimiSessionBuildResult =
  | { success: true; error_code: "none"; value: AimiSessionBuild }
  | { success: false; error_code: ErrorType; value: null };

function fail(error_code: ErrorType): AimiSessionBuildResult {
  return { success: false, error_code, value: null };
}

export function buildAimiSession(source: AimiSessionSource): AimiSessionBuildResult {
  if (source.timestamp === "") {
    return fail("timestamp required");
  }
  const identity = sessionIdentityError(
    source.session_id,
    source.tenant_id,
    source.user_id,
    source.role,
    source.previous,
  );
  if (identity !== "none") {
    return fail(identity);
  }

  let previous_workorder = null;
  let previous_diagnostic = null;
  let previous_pm = null;
  let previous_event_id = "";
  if (source.previous !== null) {
    previous_workorder = source.previous.context.workorder_snapshot;
    previous_diagnostic = source.previous.context.diagnostic_snapshot;
    previous_pm = source.previous.context.pm_snapshot;
    previous_event_id = source.previous.context.event.event_id;
  }

  const workorder_continuity = snapshotContinuityError(
    previous_workorder,
    source.workorder_snapshot,
  );
  if (workorder_continuity !== "none") {
    return fail(workorder_continuity);
  }
  const diagnostic_continuity = snapshotContinuityError(
    previous_diagnostic,
    source.diagnostic_snapshot,
  );
  if (diagnostic_continuity !== "none") {
    return fail(diagnostic_continuity);
  }
  const pm_continuity = snapshotContinuityError(previous_pm, source.pm_snapshot);
  if (pm_continuity !== "none") {
    return fail(pm_continuity);
  }

  const built = buildAimiContext(source);
  if (built.success === false || built.value === null) {
    return fail(built.error_code);
  }

  const session = freezeAimiSession({
    session_id: source.session_id,
    previous_event_id,
    tenant_id: source.tenant_id,
    user_id: source.user_id,
    role: source.role,
    timestamp: source.timestamp,
    context: built.value.context,
    engines_selected: built.value.engines_selected,
  });

  return {
    success: true,
    error_code: "none",
    value: Object.freeze({
      session,
    }),
  };
}
