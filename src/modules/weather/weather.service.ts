import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AbstractWeatherApiService } from '../../abstracts/weather-api.abstract';

import { WeatherDailyForecastDto } from './dto/weather-daily-forecast.dto';
import { WeatherHourlyForecastDto } from './dto/weather-hourly-forecast.dto';
import { WeatherResponseDto } from './dto/weather.dto';
import { WeatherCacheService } from './weather-cache.service';

@Injectable()
export class WeatherService {
  constructor(
    private readonly weatherApiService: AbstractWeatherApiService,
    private readonly cache: WeatherCacheService
  ) {}

  async getWeather(city: string): Promise<WeatherResponseDto> {
    try {
      const cachedData = await this.cache.weatherByCity.get(city);
      if (cachedData) {
        return cachedData;
      }
      const weatherData = await this.weatherApiService.getWeather(city);
      await this.cache.weatherByCity.set(city, weatherData);
      return weatherData;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async getDailyForecast(city: string): Promise<WeatherDailyForecastDto> {
    const cachedData = await this.cache.dailyForecastByCity.get(city);
    if (cachedData) {
      return cachedData;
    }
    const forecastData = await this.weatherApiService.getDailyForecast(city);
    await this.cache.dailyForecastByCity.set(city, forecastData);
    return forecastData;
  }

  async getHourlyForecast(city: string): Promise<WeatherHourlyForecastDto> {
    const cachedData = await this.cache.hourlyForecastByCity.get(city);
    if (cachedData) {
      return cachedData;
    }
    const forecastData = await this.weatherApiService.getHourlyForecast(city);
    await this.cache.hourlyForecastByCity.set(city, forecastData);
    return forecastData;
  }
}
