import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MailService } from './contracts/mail.service';
import { SendConfirmationMailDto } from './dto/send-confirmation-mail.dto';
import { SendDailyForecastMailDto } from './dto/send-daily-forecast-mail.dto';
import { SendHourlyForecastMailDto } from './dto/send-hourly-forecast-mail.dto';

@Injectable()
export class MailServiceImpl implements MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {}

  async sendSubscriptionConfirmation({
    email,
    token,
    city,
    frequency,
  }: SendConfirmationMailDto) {
    const urlConfirm = `${this.configService.get('BACK_BASE_URL')}/api/confirm/${token}`;
    const urlUnsubscribe = `${this.configService.get('BACK_BASE_URL')}/api/unsubscribe/${token}`;

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
  }

  async sendDailyForecast(dto: SendDailyForecastMailDto): Promise<void> {
    await this.mailerService.sendMail({
      to: dto.email,
      subject: `Daily Forecast for ${dto.city}`,
      template: './daily-forecast',
      context: dto
    });
  }

  async sendHourlyForecast(dto: SendHourlyForecastMailDto): Promise<void> {
    await this.mailerService.sendMail({
      to: dto.email,
      subject: `Hourly Forecast for ${dto.city}`,
      template: './hourly-forecast',
      context: dto
    });
  }
}
