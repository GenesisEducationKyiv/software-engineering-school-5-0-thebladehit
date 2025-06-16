import { Module } from '@nestjs/common';

import { MailModule } from '../mail/mail.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { WeatherModule } from '../weather/weather.module';

import { WeatherNotification } from './weather-notification.service';

@Module({
  imports: [WeatherModule, SubscriptionsModule, MailModule],
  providers: [WeatherNotification],
})
export class NotifierModule {}
