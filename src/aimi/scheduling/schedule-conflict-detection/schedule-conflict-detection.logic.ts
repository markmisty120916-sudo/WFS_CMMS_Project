/**
 * AIMI Engine — Schedule Conflict Detection
 * WFS Universal CMMS
 * Phase 3 diagnostic. Structural window checks only.
 */

export type ScheduleConflictInput = {
  scheduleId?: string;
  windowStart?: string | null;
  windowEnd?: string | null;
  duration?: number;
};

export type ScheduleConflictResult = {
  scheduleId: string;
  conflictFlag: boolean;
};

function asLabel(value: string | undefined): string {
  if (value === undefined || value === '') {
    return 'unknown';
  }
  return value;
}

function isMissingWindow(value: string | null | undefined): boolean {
  if (value === undefined || value === null) {
    return true;
  }
  if (value === '') {
    return true;
  }
  if (value === 'unknown') {
    return true;
  }
  return false;
}

export function detectScheduleConflict(input: ScheduleConflictInput): ScheduleConflictResult {
  // TODO: apply multi-schedule conflict rules (resource overlap, technician double-booking).

  let conflictFlag = false;

  if (isMissingWindow(input.windowStart)) {
    conflictFlag = false;
  }
  if (isMissingWindow(input.windowEnd)) {
    conflictFlag = false;
  }
  if (!isMissingWindow(input.windowStart)) {
    if (!isMissingWindow(input.windowEnd)) {
      const windowStart = input.windowStart as string;
      const windowEnd = input.windowEnd as string;
      if (windowStart > windowEnd) {
        conflictFlag = true;
      }
    }
  }
  if (input.duration !== undefined) {
    if (input.duration < 0) {
      conflictFlag = true;
    }
  }

  return {
    scheduleId: asLabel(input.scheduleId),
    conflictFlag,
  };
}
