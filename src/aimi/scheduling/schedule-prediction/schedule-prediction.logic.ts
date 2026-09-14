/**
 * AIMI Engine — Schedule Prediction
 * WFS Universal CMMS
 * Phase P3 forecast. Deterministic slot feasibility only.
 */

export type ScheduleSlotFeasibilityInput = {
  scheduleId?: string;
  windowStart?: string | Date;
  windowEnd?: string | Date;
  durationMinutes?: number;
};

export type ScheduleSlotFeasibilityResult = {
  scheduleId: string;
  slotFeasible: boolean;
};

function asLabel(value: string | undefined): string {
  if (value === undefined || value === '') {
    return 'unknown';
  }
  return value;
}

function asTimeMs(value: string | Date | undefined): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value instanceof Date) {
    const ms = value.getTime();
    if (ms !== ms) {
      return undefined;
    }
    return ms;
  }
  if (value === '') {
    return undefined;
  }
  const parsed = Date.parse(value);
  if (parsed !== parsed) {
    return undefined;
  }
  return parsed;
}

export function forecastScheduleSlotFeasibility(
  input: ScheduleSlotFeasibilityInput,
): ScheduleSlotFeasibilityResult {
  // TODO: apply future feasibility heuristics (travel, shop hours, technician overlap).

  const scheduleId = asLabel(input.scheduleId);
  const startMs = asTimeMs(input.windowStart);
  const endMs = asTimeMs(input.windowEnd);

  if (startMs === undefined) {
    return { scheduleId, slotFeasible: false };
  }
  if (endMs === undefined) {
    return { scheduleId, slotFeasible: false };
  }
  if (input.durationMinutes === undefined) {
    return { scheduleId, slotFeasible: false };
  }

  const windowMinutes = (endMs - startMs) / 60000;
  if (input.durationMinutes > windowMinutes) {
    return { scheduleId, slotFeasible: false };
  }

  return { scheduleId, slotFeasible: true };
}
