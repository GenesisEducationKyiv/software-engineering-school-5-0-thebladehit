import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Subscription } from '@prisma/client';

import { MailService } from '../mail/contracts/mail.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { WeatherDailyForecastDto } from '../weather/dto/weather-daily-forecast.dto';
import { WeatherHourlyForecastDto } from '../weather/dto/weather-hourly-forecast.dto';
import { WeatherService } from '../weather/weather.service';

@Injectable()
export class WeatherNotificationService {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly subscriptionService: SubscriptionsService,
    private readonly mailService: MailService
  ) {}

  @Cron('30 8 * * *')
  async notifyDailySubscribers(): Promise<void> {
    const promises: Promise<void>[] = [];
    const localCache = new Map<string, WeatherDailyForecastDto>();

    const subscriptions = await this.subscriptionService.getDailySubscribers();
    for (const subscription of subscriptions) {
      const cached = localCache.get(subscription.city);
      const forecast = cached
        ? cached
        : await this.weatherService.getDailyForecast(subscription.city);
      if (!forecast) {
        await this.clearIncorrectSubscriptions(subscription.id);
        continue;
      }
      localCache.set(subscription.city, forecast);
      promises.push(
        this.mailService.sendDailyForecast({
          email: subscription['user'].email,
          city: subscription.city,
          ...forecast,
        })
      );
    }
    await Promise.allSettled(promises);
  }

  @Cron('5 * * * *')
  async notifyHourlySubscribers(): Promise<void> {
    const promises: Promise<void>[] = [];
    const localCache = new Map<string, WeatherHourlyForecastDto>();

    const subscriptions = await this.subscriptionService.getHourlySubscribers();
    for (const subscription of subscriptions) {
      const cached = localCache.get(subscription.city);
      const forecast = cached
        ? cached
        : await this.weatherService.getHourlyForecast(subscription.city);
      if (!forecast) {
        await this.clearIncorrectSubscriptions(subscription.id);
        continue;
      }
      localCache.set(subscription.city, forecast);
      promises.push(
        this.mailService.sendHourlyForecast({
          email: subscription['user'].email,
          city: subscription.city,
          ...forecast,
        })
      );
    }
    await Promise.allSettled(promises);
  }

  private clearIncorrectSubscriptions(
    subscriptionId: string
  ): Promise<Subscription> {
    return this.subscriptionService.deleteSubscription(subscriptionId);
  }
}
