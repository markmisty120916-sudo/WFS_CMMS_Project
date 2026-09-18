import { PARTS_MANAGER_PREDICTIVE_TYPES } from "../parts-manager-dashboard-events";

export function isPartsPredictiveEventType(event_type: string): boolean {
  let index = 0;
  while (index < PARTS_MANAGER_PREDICTIVE_TYPES.length) {
    if (PARTS_MANAGER_PREDICTIVE_TYPES[index] === event_type) {
      return true;
    }
    index = index + 1;
  }
  return false;
}
