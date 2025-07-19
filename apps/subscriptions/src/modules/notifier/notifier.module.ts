import { EventBusModule } from '@app/common/event-bus';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { WeatherModule } from '../weather/weather.module';

import { WeatherNotification } from './weather-notification.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    SubscriptionsModule,
    WeatherModule,
    EventBusModule,
  ],
  providers: [WeatherNotification],
})
export class NotifierModule {}
