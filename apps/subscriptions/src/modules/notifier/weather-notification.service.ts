import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

import { AbstractNotificationsService } from '../notifications/abstracts/notifications.abstract';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { SubscriptionWithUserAndCity } from '../subscriptions/types/subscription-with-user-city';
import { AbstractWeatherService } from '../weather/abstracts/weather.abstract';

@Injectable()
export class WeatherNotification {
  private readonly batchSize: number;

  constructor(
    private readonly weatherService: AbstractWeatherService,
    private readonly subscriptionService: SubscriptionsService,
    private readonly notificationsService: AbstractNotificationsService,
    private readonly configService: ConfigService
  ) {
    this.batchSize = this.configService.get<number>('BATCH_SIZE');
  }

  @Cron('30 8 * * *')
  async notifyDailySubscribers(): Promise<void> {
    let lastId: string | undefined = undefined;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const subscriptions = await this.subscriptionService.getDailySubscribers(
        this.batchSize,
        lastId
      );
      if (subscriptions.length === 0) break;
      lastId = subscriptions[subscriptions.length - 1].id;

      const uniqueCities = this.getUniqueCities(subscriptions);
      const forecasts =
        await this.weatherService.getDailyForecasts(uniqueCities);

      const promises = subscriptions.map((sub) => {
        const forecast = forecasts[sub.city.name];
        if (forecast === null) return;
        return this.notificationsService.sendDailyForecast({
          email: sub.user.email,
          city: sub.city.name,
          ...forecast,
        });
      });

      await Promise.allSettled(promises);
    }
  }

  @Cron('5 * * * *')
  async notifyHourlySubscribers(): Promise<void> {
    let lastId: string | undefined = undefined;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const subscriptions = await this.subscriptionService.getHourlySubscribers(
        this.batchSize,
        lastId
      );
      if (subscriptions.length === 0) break;
      lastId = subscriptions[subscriptions.length - 1].id;

      const uniqueCities = this.getUniqueCities(subscriptions);
      const forecasts =
        await this.weatherService.getHourlyForecasts(uniqueCities);

      const promises = subscriptions.map((sub) => {
        const forecast = forecasts[sub.city.name];
        if (forecast === null) return;
        return this.notificationsService.sendHourlyForecast({
          email: sub.user.email,
          city: sub.city.name,
          ...forecast,
        });
      });

      await Promise.allSettled(promises);
    }
  }

  private getUniqueCities(
    subscriptions: SubscriptionWithUserAndCity[]
  ): string[] {
    return [
      ...new Set(subscriptions.map((subscription) => subscription.city.name)),
    ];
  }
}
