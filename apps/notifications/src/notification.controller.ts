import {
  SendConfirmationMailDto,
  SendDailyForecastMailDto,
  SendHourlyForecastMailDto,
} from '@app/common/types';
import { Body, Controller, Post } from '@nestjs/common';

import { MailService } from './mail.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: MailService) {}

  @Post('/confirmation')
  sendConfirmation(@Body() dto: SendConfirmationMailDto): Promise<void> {
    return this.notificationService.sendSubscriptionConfirmation(dto);
  }

  @Post('/daily-forecast')
  sendDailyForecast(@Body() dto: SendDailyForecastMailDto): Promise<void> {
    return this.notificationService.sendDailyForecast(dto);
  }

  @Post('/hourly-forecast')
  sendHourlyForecast(@Body() dto: SendHourlyForecastMailDto): Promise<void> {
    return this.notificationService.sendHourlyForecast(dto);
  }
}
