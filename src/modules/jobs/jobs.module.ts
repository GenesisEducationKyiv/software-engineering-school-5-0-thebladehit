import { Module } from '@nestjs/common';

import { MailModule } from '../mail/mail.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { WeatherModule } from '../weather/weather.module';

import { WeatherNotificationService } from './weather-notification.job';

@Module({
  imports: [WeatherModule, SubscriptionsModule, MailModule],
  providers: [WeatherNotificationService],
})
export class JobsModule {}
