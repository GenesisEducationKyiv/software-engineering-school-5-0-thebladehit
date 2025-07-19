import { SubscriptionCreatedEvent } from '@app/common/event-bus';
import { SendConfirmationMailDto } from '@app/common/types';
import { Injectable } from '@nestjs/common';

import { MailService } from '../mail.service';

@Injectable()
export class SubscriptionCreatedHandler {
  constructor(private readonly mailService: MailService) {}

  async handle(event: SubscriptionCreatedEvent): Promise<void> {
    await this.mailService.sendSubscriptionConfirmation(
      event.payload as SendConfirmationMailDto
    );
  }
}
