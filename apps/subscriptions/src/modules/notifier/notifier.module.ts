import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { NotificationsModule } from '../notifications/notifications.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { WeatherModule } from '../weather/weather.module';

import { WeatherNotification } from './weather-notification.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    SubscriptionsModule,
    NotificationsModule,
    WeatherModule,
  ],
  providers: [WeatherNotification],
})
export class NotifierModule {}
