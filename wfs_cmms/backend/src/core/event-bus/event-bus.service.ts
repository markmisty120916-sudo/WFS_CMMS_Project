export type IncomingEvent = {
  tenant_id: string;
  event_type?: string;
};

export class EventBusService {
  constructor(_deps?: unknown) {}

  async publish(_incoming: IncomingEvent): Promise<IncomingEvent> {
    return _incoming;
  }
}
