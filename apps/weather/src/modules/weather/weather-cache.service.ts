import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';

import {
  WeatherDailyForecastDto,
  WeatherHourlyForecastDto,
  WeatherResponseDto,
} from '@app/common/types';

import { AbstractWeatherCacheService } from './abstracts/weather-cache.service.abstract';

@Injectable()
export class WeatherCacheService implements AbstractWeatherCacheService {
  private readonly currentWeatherPrefix: string = 'weather';
  private readonly dailyForecastPrefix: string = 'daily:forecast';
  private readonly hourlyForecastPrefix: string = 'hourly:forecast';
  private readonly cacheTTL: number;
  private readonly dailyForecastCacheTTL: number;
  private readonly hourlyForecastCacheTTL: number;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService
  ) {
    this.cacheTTL = this.configService.get<number>('WEATHER_CACHE_TTL');
    this.dailyForecastCacheTTL = this.configService.get<number>(
      'DAILY_FORECAST_CACHE_TTL'
    );
    this.hourlyForecastCacheTTL = this.configService.get<number>(
      'HOURLY_FORECAST_CACHE_TTL'
    );
  }

  public readonly weatherByCity = {
    get: async (city: string): Promise<WeatherResponseDto> =>
      this.cacheManager.get<WeatherResponseDto>(
        this.getPrefix(this.currentWeatherPrefix, city)
      ),
    set: async (
      city: string,
      data: WeatherResponseDto
    ): Promise<WeatherResponseDto> =>
      this.cacheManager.set(
        this.getPrefix(this.currentWeatherPrefix, city),
        data,
        this.cacheTTL
      ),
    del: async (city: string): Promise<boolean> =>
      this.cacheManager.del(this.getPrefix(this.currentWeatherPrefix, city)),
  };

  public readonly dailyForecastByCity = {
    get: async (city: string): Promise<WeatherDailyForecastDto> =>
      this.cacheManager.get<WeatherDailyForecastDto>(
        this.getPrefix(this.dailyForecastPrefix, city)
      ),
    set: async (
      city: string,
      data: WeatherDailyForecastDto
    ): Promise<WeatherDailyForecastDto> =>
      this.cacheManager.set(
        this.getPrefix(this.dailyForecastPrefix, city),
        data,
        this.dailyForecastCacheTTL
      ),
    del: async (city: string): Promise<boolean> =>
      this.cacheManager.del(this.getPrefix(this.dailyForecastPrefix, city)),
  };

  public readonly hourlyForecastByCity = {
    get: async (city: string): Promise<WeatherHourlyForecastDto> =>
      this.cacheManager.get<WeatherHourlyForecastDto>(
        this.getPrefix(this.hourlyForecastPrefix, city)
      ),
    set: async (
      city: string,
      data: WeatherHourlyForecastDto
    ): Promise<WeatherHourlyForecastDto> =>
      this.cacheManager.set(
        this.getPrefix(this.hourlyForecastPrefix, city),
        data,
        this.hourlyForecastCacheTTL
      ),
    del: async (city: string): Promise<boolean> =>
      this.cacheManager.del(this.getPrefix(this.hourlyForecastPrefix, city)),
  };

  private getPrefix(prefix: string, city: string): string {
    return `${prefix}:${city}`;
  }
}
