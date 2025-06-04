import { Module } from '@nestjs/common';

import { MailModule } from '../modules/mail/mail.module';
import { SubscriptionsModule } from '../modules/subscriptions/subscriptions.module';
import { WeatherModule } from '../modules/weather/weather.module';

import { WeatherNotificationService } from './weather-notification.job';

@Module({
  imports: [WeatherModule, SubscriptionsModule, MailModule],
  providers: [WeatherNotificationService],
})
export class JobsModule {}
