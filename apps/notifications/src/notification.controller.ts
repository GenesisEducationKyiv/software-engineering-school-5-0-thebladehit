import {
  ConfirmationRequest,
  DailyForecastRequest,
  Empty,
  HourlyForecastRequest,
  NotificationsServiceController,
  NotificationsServiceControllerMethods,
} from '@app/common/proto/notifications';
import {
  SendConfirmationMailDto,
  SendDailyForecastMailDto,
  SendHourlyForecastMailDto,
} from '@app/common/types';
import { validateAndGetDto } from '@app/common/utils';
import { Controller } from '@nestjs/common';

import { MailService } from './mail.service';

@Controller()
@NotificationsServiceControllerMethods()
export class NotificationController implements NotificationsServiceController {
  constructor(private readonly notificationService: MailService) {}

  async sendConfirmation(request: ConfirmationRequest): Promise<Empty> {
    const dto = await validateAndGetDto(SendConfirmationMailDto, request);
    this.notificationService.sendSubscriptionConfirmation(dto);
    return {};
  }

  async sendDailyForecast(request: DailyForecastRequest): Promise<Empty> {
    const dto = await validateAndGetDto(SendDailyForecastMailDto, request);
    this.notificationService.sendDailyForecast(dto);
    return {};
  }

  async sendHourlyForecast(request: HourlyForecastRequest): Promise<Empty> {
    const dto = await validateAndGetDto(SendHourlyForecastMailDto, request);
    this.notificationService.sendHourlyForecast(dto);
    return {};
  }
}
