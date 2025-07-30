import {
  SendConfirmationMailDto,
  SendDailyForecastMailDto,
  SendHourlyForecastMailDto,
} from '@app/common/types';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {}

  async sendSubscriptionConfirmation({
    email,
    token,
    city,
    frequency,
  }: SendConfirmationMailDto): Promise<void> {
    try {
      const urlConfirm = `${this.configService.get('BACK_BASE_URL')}/subscriptions/confirm/${token}`;
      const urlUnsubscribe = `${this.configService.get('BACK_BASE_URL')}/subscriptions/unsubscribe/${token}`;

      await this.mailerService.sendMail({
        to: email,
        subject: 'Your subscription is created! Confirm it',
        template: './confirmation',
        context: {
          city,
          frequency,
          urlConfirm,
          urlUnsubscribe,
        },
      });
      this.logger.log(`Sent confirmation email to ${email}`);
    } catch (err) {
      this.logger.error(err);
    }
  }

  async sendDailyForecast(dto: SendDailyForecastMailDto): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: dto.email,
        subject: `Daily Forecast for ${dto.city}`,
        template: './daily-forecast',
        context: dto,
      });
      this.logger.log(`Sent daily forecast email to ${dto.email}`);
    } catch (err) {
      this.logger.error(err);
    }
  }

  async sendHourlyForecast(dto: SendHourlyForecastMailDto): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: dto.email,
        subject: `Hourly Forecast for ${dto.city}`,
        template: './hourly-forecast',
        context: dto,
      });
      this.logger.log(`Sent hourly forecast email to ${dto.email}`);
    } catch (err) {
      this.logger.error(err);
    }
  }
}
