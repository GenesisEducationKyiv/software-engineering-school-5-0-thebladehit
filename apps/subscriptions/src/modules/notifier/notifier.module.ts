import { Module } from '@nestjs/common';

import { NotificationsModule } from '../notifications/notifications.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { WeatherModule } from '../weather/weather.module';

import { WeatherNotification } from './weather-notification.service';

@Module({
  imports: [SubscriptionsModule, NotificationsModule, WeatherModule],
  providers: [WeatherNotification],
})
export class NotifierModule {}
