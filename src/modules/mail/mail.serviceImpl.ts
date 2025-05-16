import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import {MailService} from "./contracts/mail.service";

@Injectable()
export class MailServiceImpl implements MailService{
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {}

  async sendSubscriptionConfirmation(token: string, email: string) {
    const url = `${this.configService.get('BACK_BASE_URL')}/confirm/${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Your subscription is created! Confirm it',
      template: './confirmation',
      context: {
        url,
      },
    });
  }
}
