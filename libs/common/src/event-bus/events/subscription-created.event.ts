import { Event, EventTypes } from '@app/common/event-bus';
import { SendConfirmationMailDto } from '@app/common/types';

export class SubscriptionCreatedEvent implements Event {
  readonly type = EventTypes.SUBSCRIPTION_CREATED;
  readonly payload: SendConfirmationMailDto;

  constructor(payload: SendConfirmationMailDto) {
    this.payload = payload;
  }
}
