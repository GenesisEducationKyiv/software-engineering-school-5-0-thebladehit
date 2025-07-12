import { Module } from '@nestjs/common';

import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

import { WeatherNotification } from './weather-notification.service';

@Module({
  imports: [SubscriptionsModule],
  providers: [WeatherNotification],
})
export class NotifierModule {}
