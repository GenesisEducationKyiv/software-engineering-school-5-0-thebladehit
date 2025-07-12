import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { AbstractNotificationsService } from '../notifications/abstracts/notifications.abstract';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { AbstractWeatherService } from '../weather/abstracts/weather.abstract';

@Injectable()
export class WeatherNotification {
  constructor(
    private readonly weatherService: AbstractWeatherService,
    private readonly subscriptionService: SubscriptionsService,
    private readonly notificationsService: AbstractNotificationsService
  ) {}

  @Cron('30 8 * * *')
  async notifyDailySubscribers(): Promise<void> {
    const promises: Promise<void>[] = [];

    const subscriptions = await this.subscriptionService.getDailySubscribers();
    for (const subscription of subscriptions) {
      const forecast = await this.weatherService.getDailyForecast(
        subscription.city.name
      );
      promises.push(
        this.notificationsService.sendDailyForecast({
          email: subscription['user'].email,
          city: subscription.city.name,
          ...forecast,
        })
      );
    }
    await Promise.allSettled(promises);
  }

  @Cron('5 * * * *')
  async notifyHourlySubscribers(): Promise<void> {
    const promises: Promise<void>[] = [];

    const subscriptions = await this.subscriptionService.getHourlySubscribers();
    for (const subscription of subscriptions) {
      const forecast = await this.weatherService.getHourlyForecast(
        subscription.city.name
      );
      promises.push(
        this.notificationsService.sendHourlyForecast({
          email: subscription['user'].email,
          city: subscription.city.name,
          ...forecast,
        })
      );
    }
    await Promise.allSettled(promises);
  }
}
