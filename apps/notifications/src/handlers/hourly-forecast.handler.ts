import { HourlyForecastEvent } from '@app/common/event-bus';
import { Injectable } from '@nestjs/common';

import { MailService } from '../mail.service';

@Injectable()
export class HourlyForecastHandler {
  constructor(private readonly mailService: MailService) {}

  async handle(event: HourlyForecastEvent): Promise<void> {
    await this.mailService.sendHourlyForecast(event.payload);
  }
}
