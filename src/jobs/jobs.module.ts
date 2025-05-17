import { Module } from '@nestjs/common';
import { WeatherModule } from '../modules/weather/weather.module';
import { WeatherNotificationService } from './weather-notification.job';
import { SubscriptionsModule } from '../modules/subscriptions/subscriptions.module';
import { MailModule } from '../modules/mail/mail.module';

@Module({
  imports: [WeatherModule, SubscriptionsModule, MailModule],
  providers: [WeatherNotificationService],
})
export class JobsModule {}
