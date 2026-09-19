import type { PmSchedule, PmScheduleQuery, PmTemplate } from "../pm.interface";

export function filterSchedulesByAsset(
  schedules: readonly PmSchedule[],
  asset_id: string,
): readonly PmSchedule[] {
  if (asset_id === "") {
    return schedules;
  }
  const filtered: PmSchedule[] = [];
  let index = 0;
  while (index < schedules.length) {
    const row = schedules[index];
    if (row.asset_id === asset_id) {
      filtered.push(row);
    }
    index = index + 1;
  }
  return filtered;
}

export function filterOpenSchedules(schedules: readonly PmSchedule[]): readonly PmSchedule[] {
  const filtered: PmSchedule[] = [];
  let index = 0;
  while (index < schedules.length) {
    const row = schedules[index];
    if (row.status !== "completed") {
      filtered.push(row);
    }
    index = index + 1;
  }
  return filtered;
}

export function scheduleQueryAssetId(query: PmScheduleQuery): string {
  return query.asset_id;
}

export function templateNameMatches(template: PmTemplate, name: string): boolean {
  if (name === "") {
    return true;
  }
  if (template.name === name) {
    return true;
  }
  return false;
}
