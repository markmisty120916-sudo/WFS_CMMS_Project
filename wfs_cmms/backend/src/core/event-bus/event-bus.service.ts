export type IncomingEvent = {
  tenant_id: string;
  event_type?: string;
};

export class EventBusService {
  async publish(_incoming: IncomingEvent): Promise<IncomingEvent> {
    return _incoming;
  }
}
