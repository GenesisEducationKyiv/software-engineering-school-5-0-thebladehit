import {
  SendConfirmationMailDto,
  SendDailyForecastMailDto,
  SendHourlyForecastMailDto,
} from '@app/common/types';
import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

import { AbstractNotificationsService } from './abstracts/notifications.abstract';

@Injectable()
export class NotificationsHttpService implements AbstractNotificationsService {
  private readonly notificationsServiceUrl: string;
  private readonly logger = new Logger(NotificationsHttpService.name);

  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.notificationsServiceUrl =
      this.configService.getOrThrow('NOTIFICATIONS_URL');
  }

  async sendSubscriptionConfirmation(
    dto: SendConfirmationMailDto
  ): Promise<void> {
    const url = `${this.notificationsServiceUrl}/confirmation`;
    await this.send(url, dto);
  }

  async sendDailyForecast(dto: SendDailyForecastMailDto): Promise<void> {
    const url = `${this.notificationsServiceUrl}/daily-forecast`;
    await this.send(url, dto);
  }

  async sendHourlyForecast(dto: SendHourlyForecastMailDto): Promise<void> {
    const url = `${this.notificationsServiceUrl}/hourly-forecast`;
    await this.send(url, dto);
  }

  private async send(url: string, payload: unknown): Promise<void> {
    try {
      await firstValueFrom(this.httpService.post(url, payload));
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.code === 'ECONNREFUSED') {
          this.logger.error('Notification service in not reachable');
        }
        const status = err.response?.status;
        if (status === 400) {
          throw new HttpException(err.response?.data, status);
        }
      }
      throw new InternalServerErrorException();
    }
  }
}
