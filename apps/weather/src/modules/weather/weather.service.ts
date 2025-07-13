import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  CitiesDailyForecastDto,
  CitiesHourlyForecastDto,
  WeatherResponseDto,
} from '@app/common/types';

import { AbstractWeatherApiService } from '../../abstracts/weather-api.abstract';
import { AbstractMetricsService } from '../metrics/abstracts/metrics.service.abstract';

import { AbstractWeatherCacheService } from './abstracts/weather-cache.service.abstract';

@Injectable()
export class WeatherService {
  constructor(
    private readonly weatherApiService: AbstractWeatherApiService,
    private readonly metricService: AbstractMetricsService,
    private readonly cache: AbstractWeatherCacheService
  ) {}

  async getWeather(city: string): Promise<WeatherResponseDto> {
    try {
      const cachedData = await this.cache.weatherByCity.get(city);
      if (cachedData) {
        this.metricService.incFromCache();
        return cachedData;
      }
      const weatherData = await this.weatherApiService.getWeather(city);
      this.metricService.incFromApi();
      await this.cache.weatherByCity.set(city, weatherData);
      return weatherData;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async getDailyForecasts(cities: string[]): Promise<CitiesDailyForecastDto> {
    const result: CitiesDailyForecastDto = {};

    for (const city of cities) {
      const cachedData = await this.cache.dailyForecastByCity.get(city);
      if (cachedData) {
        this.metricService.incFromCache();
        result[city] = cachedData;
        continue;
      }
      const forecastData = await this.weatherApiService
        .getDailyForecast(city)
        .catch((err) => {
          if (err instanceof NotFoundException) {
            return null;
          }
          throw err;
        });
      if (forecastData === null) {
        result[city] = null;
        continue;
      }
      this.metricService.incFromApi();
      await this.cache.dailyForecastByCity.set(city, forecastData);
      result[city] = forecastData;
    }

    return result;
  }

  async getHourlyForecasts(cities: string[]): Promise<CitiesHourlyForecastDto> {
    const result: CitiesHourlyForecastDto = {};

    for (const city of cities) {
      const cachedData = await this.cache.hourlyForecastByCity.get(city);
      if (cachedData) {
        this.metricService.incFromCache();
        result[city] = cachedData;
        continue;
      }
      const forecastData = await this.weatherApiService
        .getHourlyForecast(city)
        .catch((err) => {
          if (err instanceof NotFoundException) {
            return null;
          }
          throw err;
        });
      if (forecastData === null) {
        result[city] = null;
        continue;
      }
      this.metricService.incFromApi();
      await this.cache.hourlyForecastByCity.set(city, forecastData);
      result[city] = forecastData;
    }

    return result;
  }
}
