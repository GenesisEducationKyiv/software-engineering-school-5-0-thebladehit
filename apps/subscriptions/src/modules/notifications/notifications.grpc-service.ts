import {
  NOTIFICATIONS_PACKAGE_NAME,
  NOTIFICATIONS_SERVICE_NAME,
  NotificationsServiceClient,
} from '@app/common/proto/notifications';
import {
  SendConfirmationMailDto,
  SendDailyForecastMailDto,
  SendHourlyForecastMailDto,
} from '@app/common/types';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { AbstractNotificationsService } from './abstracts/notifications.abstract';

@Injectable()
export class NotificationsGrpcService
  implements AbstractNotificationsService, OnModuleInit
{
  private readonly logger = new Logger(NotificationsGrpcService.name);
  private notificationService: NotificationsServiceClient;

  constructor(
    @Inject(NOTIFICATIONS_PACKAGE_NAME) private readonly client: ClientGrpc
  ) {}

  onModuleInit(): void {
    this.notificationService =
      this.client.getService<NotificationsServiceClient>(
        NOTIFICATIONS_SERVICE_NAME
      );
  }

  async sendSubscriptionConfirmation(
    dto: SendConfirmationMailDto
  ): Promise<void> {
    await firstValueFrom(this.notificationService.sendConfirmation(dto));
    return;
  }

  async sendDailyForecast(dto: SendDailyForecastMailDto): Promise<void> {
    await firstValueFrom(this.notificationService.sendDailyForecast(dto));
    return;
  }

  async sendHourlyForecast(dto: SendHourlyForecastMailDto): Promise<void> {
    await firstValueFrom(this.notificationService.sendHourlyForecast(dto));
    return;
  }
}
