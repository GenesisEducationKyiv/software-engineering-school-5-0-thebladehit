import { Event, EventTypes } from '@app/common/event-bus';

interface SubscriptionCreatedPayload {
  email: string;
  city: string;
  token: string;
  frequency: string;
}

export class SubscriptionCreatedEvent implements Event {
  readonly type = EventTypes.SUBSCRIPTION_CREATED;
  readonly payload: SubscriptionCreatedPayload;

  constructor(payload: SubscriptionCreatedPayload) {
    this.payload = payload;
  }
}
