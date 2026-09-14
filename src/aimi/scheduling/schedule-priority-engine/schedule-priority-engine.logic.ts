/**
 * AIMI Engine — Schedule Priority Engine
 * WFS Universal CMMS
 * Phase 4 operational proposal. No optimization.
 */

export type SchedulePriority = 'low' | 'medium' | 'high' | 'unknown';

export type SchedulePriorityInput = {
  scheduleId?: string;
  urgency?: string;
  conflictFlag?: boolean;
  windowStart?: string;
  windowEnd?: string;
};

export type SchedulePriorityResult = {
  scheduleId: string;
  priority: SchedulePriority;
};

function asLabel(value: string | undefined): string {
  if (value === undefined || value === '') {
    return 'unknown';
  }
  return value;
}

function asPriority(value: string | undefined): SchedulePriority {
  if (value === 'low') {
    return 'low';
  }
  if (value === 'medium') {
    return 'medium';
  }
  if (value === 'high') {
    return 'high';
  }
  return 'unknown';
}

function isMissingWindow(value: string | undefined): boolean {
  if (value === undefined || value === '') {
    return true;
  }
  if (value === 'unknown') {
    return true;
  }
  return false;
}

export function computeSchedulePriority(input: SchedulePriorityInput): SchedulePriorityResult {
  // TODO: apply future optimization-adjacent rules (capacity, travel, multi-job stacking). Do not optimize here.

  let priority: SchedulePriority = 'unknown';

  if (input.conflictFlag === true) {
    priority = 'high';
  }
  if (input.conflictFlag !== true) {
    priority = asPriority(input.urgency);
    if (priority === 'unknown') {
      if (!isMissingWindow(input.windowStart)) {
        if (!isMissingWindow(input.windowEnd)) {
          if (input.windowStart === input.windowEnd) {
            priority = 'high';
          }
        }
      }
    }
  }

  return {
    scheduleId: asLabel(input.scheduleId),
    priority,
  };
}
