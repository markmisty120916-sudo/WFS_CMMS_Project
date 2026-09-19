/**
 * EventBusModule — Core
 * Master Blueprint V2 / EVENT-BUS-SPEC §19
 * Ordered delivery. Failures are not swallowed. No cross-tenant delivery.
 */

import { isCategoryAllowedForRole } from "./event-normalizer";
import type { EventRoute, EventSubscriber, IntegrationEvent } from "./event.interface";

export async function deliverEvent(
  event: IntegrationEvent,
  route: EventRoute,
  subscribers: readonly EventSubscriber[],
): Promise<void> {
  if (route.tenant_id !== event.tenant_id) {
    throw new Error("tenant_id mismatch");
  }

  let index = 0;
  while (index < subscribers.length) {
    const subscriber = subscribers[index];
    index = index + 1;
    if (subscriber.tenant_id !== event.tenant_id) {
      continue;
    }
    if (subscriber.target !== route.target) {
      continue;
    }
    if (isCategoryAllowedForRole(event.event_category, subscriber.role) === false) {
      throw new Error("role unauthorized");
    }
    await subscriber.onEvent(event);
  }
}
