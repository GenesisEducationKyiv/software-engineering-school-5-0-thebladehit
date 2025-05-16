import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MailService } from './contracts/mail.service';
import { SendMailDto } from './dto/send-mail.dto';

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
  }: SendMailDto) {
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
}
