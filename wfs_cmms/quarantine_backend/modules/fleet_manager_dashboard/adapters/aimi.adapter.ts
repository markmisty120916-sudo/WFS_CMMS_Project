import { FLEET_MANAGER_INSIGHT_TYPES } from "../fleet-manager-dashboard-events";

export function isFleetAimiInsightType(event_type: string): boolean {
  let index = 0;
  while (index < FLEET_MANAGER_INSIGHT_TYPES.length) {
    if (FLEET_MANAGER_INSIGHT_TYPES[index] === event_type) {
      return true;
    }
    index = index + 1;
  }
  return false;
}
