/**
 * AIMI Session Layer
 * Master Blueprint V2 / cursor-instructions §10 / TENANT-ISOLATION / RBAC
 * Session continuity uses existing lifecycle kinds only. No session bypass.
 */

import type { DtoRole } from "../../core/dto/base.dto";
import type { ErrorType } from "../../core/errors/error-types";
import { isTransitionAllowed } from "../../core/lifecycle-engine/lifecycle-guards";
import type { LifecycleSnapshot } from "../../core/lifecycle-engine/lifecycle-snapshot";
import type { LifecycleKind } from "../../core/lifecycle-engine/lifecycle-state.interface";
import type { AimiSession } from "./aimi-session.interface";

export function isTerminalLifecycleState(kind: LifecycleKind, state: string): boolean {
  if (kind === "workorder") {
    if (state === "CLOSED") {
      return true;
    }
    return false;
  }
  if (kind === "diagnostic") {
    if (state === "CLOSEOUT_CHECKLIST") {
      return true;
    }
    return false;
  }
  if (kind === "pm") {
    if (state === "PM_WORKORDER_CREATION") {
      return true;
    }
    return false;
  }
  return false;
}

export function isTerminalSnapshot(snapshot: LifecycleSnapshot | null): boolean {
  if (snapshot === null) {
    return false;
  }
  return isTerminalLifecycleState(snapshot.kind, snapshot.state);
}

export function isSessionTerminal(session: AimiSession): boolean {
  if (isTerminalSnapshot(session.context.workorder_snapshot) === true) {
    return true;
  }
  if (isTerminalSnapshot(session.context.diagnostic_snapshot) === true) {
    return true;
  }
  if (isTerminalSnapshot(session.context.pm_snapshot) === true) {
    return true;
  }
  return false;
}

export function sessionIdentityError(
  session_id: string,
  tenant_id: string,
  user_id: string,
  role: DtoRole,
  previous: AimiSession | null,
): ErrorType | "none" {
  if (session_id === "") {
    return "entity_id required";
  }
  if (tenant_id === "") {
    return "tenant_id required";
  }
  if (user_id === "") {
    return "user_id required";
  }
  if (previous === null) {
    return "none";
  }
  if (previous.session_id !== session_id) {
    return "entity_id mismatch";
  }
  if (previous.tenant_id !== tenant_id) {
    return "tenant_id mismatch";
  }
  if (previous.user_id !== user_id) {
    return "dto invalid";
  }
  if (previous.role !== role) {
    return "role unauthorized";
  }
  if (isSessionTerminal(previous) === true) {
    return "lifecycle transition invalid";
  }
  return "none";
}

export function snapshotContinuityError(
  previous: LifecycleSnapshot | null,
  next: LifecycleSnapshot | null,
): ErrorType | "none" {
  if (previous === null) {
    if (next === null) {
      return "none";
    }
    if (next.previous_state === "") {
      return "none";
    }
    if (next.previous_state === next.state) {
      return "none";
    }
    if (
      isTransitionAllowed({
        kind: next.kind,
        from_state: next.previous_state,
        to_state: next.state,
      }) === true
    ) {
      return "none";
    }
    return "lifecycle transition invalid";
  }
  if (next === null) {
    return "dto invalid";
  }
  if (previous.tenant_id !== next.tenant_id) {
    return "tenant_id mismatch";
  }
  if (previous.kind !== next.kind) {
    return "lifecycle kind mismatch";
  }
  if (previous.entity_id !== next.entity_id) {
    return "entity_id mismatch";
  }
  if (previous.state === next.state) {
    return "none";
  }
  if (
    isTransitionAllowed({
      kind: next.kind,
      from_state: previous.state,
      to_state: next.state,
    }) === true
  ) {
    return "none";
  }
  return "lifecycle transition invalid";
}
