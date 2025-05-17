import { Injectable } from '@nestjs/common';
import { WeatherService } from '../modules/weather/weather.service';
import { SubscriptionsService } from '../modules/subscriptions/subscriptions.service';
import { Cron } from '@nestjs/schedule';
import { MailService } from '../modules/mail/contracts/mail.service';
import { WeatherDailyForecastDto } from '../modules/weather/dto/weather-daily-forecast.dto';
import { WeatherHourlyForecastDto } from '../modules/weather/dto/weather-hourly-forecast.dto';

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

  private clearIncorrectSubscriptions(subscriptionId: string) {
    return this.subscriptionService.deleteSubscription(subscriptionId);
  }
}
