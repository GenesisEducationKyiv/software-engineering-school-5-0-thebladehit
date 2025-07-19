import { DailyForecastEvent } from '@app/common/event-bus';
import { Injectable } from '@nestjs/common';

import { MailService } from '../mail.service';

@Injectable()
export class DailyForecastHandler {
  constructor(private readonly mailService: MailService) {}

  async handle(event: DailyForecastEvent): Promise<void> {
    await this.mailService.sendDailyForecast(event.payload);
  }
}
